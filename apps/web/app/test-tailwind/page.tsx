export default function TestTailwind() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Test Tailwind Classes</h1>
      
      {/* Test de colores básicos */}
      <div className="space-y-2">
        <div className="p-4 bg-background border border-border rounded">
          <span className="text-foreground">bg-background + border-border</span>
        </div>
        
        <div className="p-4 bg-card border border-border rounded">
          <span className="text-card-foreground">bg-card + border-border</span>
        </div>
        
        <div className="p-4 bg-popover border border-border rounded">
          <span className="text-popover-foreground">bg-popover + border-border</span>
        </div>
        
        <div className="p-4 bg-primary text-primary-foreground rounded">
          <span>bg-primary + text-primary-foreground</span>
        </div>
        
        <div className="p-4 bg-secondary text-secondary-foreground rounded">
          <span>bg-secondary + text-secondary-foreground</span>
        </div>
        
        <div className="p-4 bg-muted text-muted-foreground rounded">
          <span>bg-muted + text-muted-foreground</span>
        </div>
      </div>
      
      {/* Test de hover */}
      <div className="space-y-2">
        <button className="p-4 bg-secondary hover:bg-accent text-secondary-foreground hover:text-accent-foreground rounded transition-colors">
          Hover test: bg-secondary → bg-accent
        </button>
      </div>
    </div>
  );
}
