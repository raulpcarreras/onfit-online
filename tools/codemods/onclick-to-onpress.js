/**
 * Codemod: onClick -> onPress SOLO para <Button> del DS
 * Soporta:
 *  - import { Button } from "@repo/design/components/Button"
 *  - import { Button as X } from "@repo/design/components/Button"
 *  - import { Button } from "@repo/design/components"
 *  - import DS from "@repo/design/components"  y <DS.Button ... />
 */

const isDesignButtonSource = (src) => {
  if (typeof src !== 'string') return false;
  return (
    src === '@repo/design/components/Button' ||
    src === '@repo/design/components' ||
    src.endsWith('/components/Button') ||
    src.endsWith('/components')
  );
};

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // 1) Descubrir nombres locales del Button del DS
  const localButtonNames = new Set();    // p.ej. "Button" o "DSButton" (alias)
  const namespaceIds = new Set();        // p.ej. "DS" si usaron import * as DS

  root.find(j.ImportDeclaration)
    .filter(p => isDesignButtonSource(p.node.source.value))
    .forEach(p => {
      p.node.specifiers.forEach(spec => {
        if (spec.type === 'ImportSpecifier') {
          // import { Button } from ...
          if (spec.imported && spec.imported.name === 'Button') {
            localButtonNames.add(spec.local ? spec.local.name : 'Button');
          }
        } else if (spec.type === 'ImportDefaultSpecifier') {
          // import Button from ...   (menos común, pero soportado)
          localButtonNames.add(spec.local.name);
        } else if (spec.type === 'ImportNamespaceSpecifier') {
          // import * as DS from ...  -> <DS.Button ... />
          namespaceIds.add(spec.local.name);
        }
      });
    });

  if (localButtonNames.size === 0 && namespaceIds.size === 0) {
    return file.source; // nada que hacer
  }

  // 2) En JSX: localizar <Button ... onClick=... /> (o <Alias ... />) y <DS.Button ... onClick=... />
  root.find(j.JSXOpeningElement)
    .filter(path => {
      const name = path.node.name;

      if (name.type === 'JSXIdentifier') {
        // <Button ...>
        return localButtonNames.has(name.name);
      }

      if (name.type === 'JSXMemberExpression') {
        // <DS.Button ...>
        const obj = name.object;
        const prop = name.property;
        return (
          obj &&
          prop &&
          obj.type === 'JSXIdentifier' &&
          prop.type === 'JSXIdentifier' &&
          namespaceIds.has(obj.name) &&
          prop.name === 'Button'
        );
      }

      return false;
    })
    .forEach(path => {
      const attrs = path.node.attributes || [];
      const hasOnPress = attrs.some(
        a => a.type === 'JSXAttribute' && a.name && a.name.name === 'onPress'
      );

      path.node.attributes = attrs.map(attr => {
        if (
          attr.type === 'JSXAttribute' &&
          attr.name &&
          attr.name.name === 'onClick'
        ) {
          if (hasOnPress) {
            // Ya hay onPress → eliminamos onClick duplicado
            return null;
          }
          // Renombrar onClick -> onPress
          attr.name.name = 'onPress';
          return attr;
        }
        return attr;
      }).filter(Boolean);
    });

  return root.toSource({ quote: 'single', reuseWhitespace: false });
};
