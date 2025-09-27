# Component Pattern Template

```tsx
import { useState } from "react";

interface {{ComponentName}}Props {
  // TODO: define props
}

export function {{ComponentName}}(props: {{ComponentName}}Props) {
  const [state, setState] = useState<{{StateShape}}>();

  // Replace placeholder logic with real implementation
  return (
    <div>
      {/* TODO: render UI */}
    </div>
  );
}
```

## Implementation Checklist
- Replace `{{ComponentName}}` and `{{StateShape}}` placeholders.
- Ensure props are typed; remove unused state hooks.
- Add tests under the same directory using `.test.tsx` naming.
- Update documentation or storybook entries if applicable.
