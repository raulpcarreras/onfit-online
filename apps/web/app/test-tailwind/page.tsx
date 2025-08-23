"use client";
import React from "react";
import { Card } from "@repo/design/components/Card";
import { Button } from "@repo/design/components/Button";
import { Text } from "@repo/design/components/Text";

export default function TestTailwind() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Test Tailwind Classes</h1>
      
      {/* Test de colores básicos */}
      <div className="space-y-2">
        <Card className="p-4 bg-background border-border">
          <Text className="text-foreground">bg-background + border-border</Text>
        </Card>
        
        <Card className="p-4 bg-card border-border">
          <Text className="text-card-foreground">bg-card + border-border</Text>
        </Card>
        
        <Card className="p-4 bg-popover border-border">
          <Text className="text-popover-foreground">bg-popover + border-border</Text>
        </Card>
        
        <Card className="p-4 bg-primary text-primary-foreground">
          <Text>bg-primary + text-primary-foreground</Text>
        </Card>
        
        <Card className="p-4 bg-secondary text-secondary-foreground">
          <Text>bg-secondary + text-secondary-foreground</Text>
        </Card>
        
        <Card className="p-4 bg-muted text-muted-foreground">
          <Text>bg-muted + text-muted-foreground</Text>
        </Card>
      </div>
      
      {/* Test de hover */}
      <div className="space-y-2">
        <Button 
          className="p-4 bg-secondary hover:bg-accent text-secondary-foreground hover:text-accent-foreground transition-colors"
          onPress={() => {}}
        >
          Hover test: bg-secondary → bg-accent
        </Button>
      </div>
    </div>
  );
}
