# Endpoint Handler Template

```ts
import { Request, Response } from "express";
import { {{ServiceName}} } from "../services/{{serviceModule}}";
import { handleError } from "../utils/handleError";

export async function {{handlerName}}(req: Request, res: Response) {
  try {
    const result = await {{ServiceName}}({
      // Map request data here
    });

    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
}
```

## Implementation Checklist
- Replace placeholders (`{{handlerName}}`, `{{ServiceName}}`, `{{serviceModule}}`).
- Validate inputs using shared schema helpers before calling services.
- Document the endpoint details in `api-surface.md`.
- Add integration or unit tests covering success and failure paths.
