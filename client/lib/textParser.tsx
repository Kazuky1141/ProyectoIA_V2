import React from "react";

export function parseFormattedText(text: string): React.ReactNode {
  // First, split by numbered items (1. 2. 3. etc.)
  const numberedParts = text.split(/(\d+\.\s*)/);

  const elements: React.ReactNode[] = [];

  for (let i = 0; i < numberedParts.length; i++) {
    const part = numberedParts[i];

    if (/^\d+\.\s*$/.test(part)) {
      // This is a number marker (like "1. " or "2. ")
      if (i + 1 < numberedParts.length) {
        const content = numberedParts[i + 1];
        elements.push(
          <div key={i} className="mb-2">
            <span className="font-semibold text-primary">{part}</span>
            {parseBoldText(content)}
          </div>,
        );
        i++; // Skip the next part since we processed it
      }
    } else if (part.trim()) {
      // Regular text - check if it contains numbered patterns
      if (part.includes("1)") || part.includes("2)") || part.includes("3)")) {
        // Split by patterns like "1) ", "2) ", etc.
        const parts = part.split(/(\d+\)\s*)/);
        for (let j = 0; j < parts.length; j++) {
          const subPart = parts[j];
          if (/^\d+\)\s*$/.test(subPart)) {
            if (j + 1 < parts.length) {
              const content = parts[j + 1];
              elements.push(
                <div key={`${i}-${j}`} className="mb-2">
                  <span className="font-semibold text-primary">{subPart}</span>
                  {parseBoldText(content)}
                </div>,
              );
              j++; // Skip the next part
            }
          } else if (subPart.trim()) {
            elements.push(
              <span key={`${i}-${j}`}>{parseBoldText(subPart)}</span>,
            );
          }
        }
      } else {
        elements.push(<span key={i}>{parseBoldText(part)}</span>);
      }
    }
  }

  return <>{elements}</>;
}

function parseBoldText(text: string): React.ReactNode {
  // Split by **bold** patterns
  const parts = text.split(/(\*\*[^*]+\*\*)/);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // Remove the ** and make it bold
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-foreground">
          {boldText}
        </strong>
      );
    }
    return part;
  });
}

export function formatTechnicalText(text: string): React.ReactNode {
  return parseFormattedText(text);
}
