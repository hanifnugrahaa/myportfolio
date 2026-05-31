import os
import re

def replace_in_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def regex_replace(path, pattern, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(pattern, new, content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. App.tsx
replace_in_file('src/App.tsx', "import React, { useState", "import { useState")
# 2. About.tsx
replace_in_file('src/components/sections/About.tsx', 'import React, { useState } from "react";', 'import { useState } from "react";')
# 3. Contact.tsx
regex_replace('src/components/sections/Contact.tsx', r'import React from "react";\n?', '')
replace_in_file('src/components/sections/Contact.tsx', 'rows="5"', 'rows={5}')
# 4. Hero.tsx
regex_replace('src/components/sections/Hero.tsx', r"import React from 'react';\n?", '')
# 5. AnimatedSection.tsx
replace_in_file('src/components/ui/AnimatedSection.tsx', "import React, { useState", "import { useState")
replace_in_file('src/components/ui/AnimatedSection.tsx', "observer.unobserve(sectionRef.current);", "if (sectionRef.current) observer.unobserve(sectionRef.current);")
# 6. CustomCursor.tsx
replace_in_file('src/components/ui/CustomCursor.tsx', "import React, { useEffect", "import { useEffect")
# 7. DataFlowWire.tsx
replace_in_file('src/components/ui/DataFlowWire.tsx', "lineRef: React.RefObject<HTMLElement>, textRef: React.RefObject<HTMLElement>", "lineRef: React.RefObject<HTMLDivElement | null>, textRef: React.RefObject<HTMLDivElement | null>")
# 8. ErrorBoundary.tsx
replace_in_file('src/components/ui/ErrorBoundary.tsx', "import React, { Component", "import { Component")
# 9. ProjectModal.tsx
replace_in_file('src/components/ui/ProjectModal.tsx', "const fadeUpVariant = {", "const fadeUpVariant: any = {")
# 10. TerminalMode.tsx
replace_in_file('src/components/ui/TerminalMode.tsx', "string | JSX.Element", "string | React.ReactNode")
# 11. ThreeBackground.tsx
replace_in_file('src/components/ui/ThreeBackground.tsx', "import React, { useEffect", "import { useEffect")
# 12. useSecretCode.ts
replace_in_file('src/hooks/useSecretCode.ts', "const [inputBuffer, setInputBuffer]", "const [, setInputBuffer]")
# 13. useTypewriter.ts
replace_in_file('src/hooks/useTypewriter.ts', "NodeJS.Timeout", "ReturnType<typeof setTimeout>")
# 14. chatKnowledge.ts
replace_in_file('src/lib/chatKnowledge.ts', "const socialsText = socials.map", "// const socialsText = socials.map")

# 15. tsconfig.node.json
tsconfig_path = 'tsconfig.node.json'
if os.path.exists(tsconfig_path):
    with open(tsconfig_path, 'r', encoding='utf-8') as f:
        config = f.read()
    if '"allowJs": true' not in config:
        config = config.replace('"compilerOptions": {', '"compilerOptions": {\n    "allowJs": true,')
        with open(tsconfig_path, 'w', encoding='utf-8') as f:
            f.write(config)

print("Fixes applied successfully!")
