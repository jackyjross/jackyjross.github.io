// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const tabTriggers = document.querySelectorAll('.tab-trigger');
const tabContents = document.querySelectorAll('.tab-content');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');
const commandPalette = document.getElementById('command-palette');
const closePalette = document.getElementById('close-palette');
const commitInfo = document.getElementById('commit-info');
const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('resizer');

// Content storage
const pageContent = {
    projects: `# Projects

## [Chicago Streets](https://jackjross.com/) (Ongoing)
Documenting the urban landscape and human stories of Chicago through street photography.

- Focus on human moments and architectural interplay
- Exploring neighborhoods and communities

## Vietnam 2025
Returning to Vietnam for a new photographic series.

- Building on 2018-2023 documentation
- New perspectives and stories
- Cultural exploration

## Vietnam 2018-2023
Five years of documenting Vietnam's streets, people, and culture.

- Long-term photographic project
- Multiple visits and deep cultural immersion
- Published work and exhibitions
`,
    tools: `# Tools

## Photography Gear
- Fujifilm X-Pro3
- XF 23mm F2
- Editing software (Lightroom, Capture One)

## Digital Tools
- superhuman
- github
- claude code
- slack
- whispr flow
- cursor
- replit

## Workflow
- Synology NAS
- Backblaze
- Dropbox Business
`,
    blog: `# Blog

Coming soon - thoughts on photography, travel, and creative process.

Check out my [Substack](https://jackjross.substack.com) for the latest writing.
`,
    dayjob: `# Day Job

<a href="https://www.linkedin.com/in/jackjross/" target="_blank" class="linkedin-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>

## Current

**Associate Director of Growth** @ [CPGIO](https://cpg.io)
*Jan 2024 - Present*

Partner once, sell everywhere. Helping brands unlock growth through eCommerce.

---

## Experience

**Creative Strategist** - Jack Ross Co
*Apr 2018 - Dec 2023* · Vietnam

**Senior Inside Sales Rep** - Narrative Science
*May 2017 - Apr 2018* · Built inside sales desk from scratch, 100-120% to quota

**Senior Account Executive** - Raise
*Jan 2016 - May 2017* · Grew book from $100K to $1.3M

**Earlier:** TMC/C.H. Robinson, Kraft Heinz, Jimmy John's

---

## Education

**UW-Whitewater** - BBA, Supply Chain Management

**Parkland College** - AS, Business Management
`
};

// Tab switching
function switchTab(tabName) {
    tabTriggers.forEach(trigger => {
        if (trigger.dataset.tab === tabName) {
            trigger.classList.add('active');
        } else {
            trigger.classList.remove('active');
        }
    });

    tabContents.forEach(content => {
        if (content.id === `${tabName}-content`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Load content
    const bodyElement = document.getElementById(`${tabName}-body`);
    if (bodyElement && pageContent[tabName]) {
        bodyElement.innerHTML = `<code>${marked.parse(pageContent[tabName])}</code>`;
    }

    // Random additions/deletions for effect
    const additions = Math.floor(Math.random() * 20);
    const deletions = Math.floor(Math.random() * 10);
    document.getElementById('additions').textContent = `+${additions}`;
    document.getElementById('deletions').textContent = `-${deletions}`;
}

// Tab click handlers
tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        switchTab(trigger.dataset.tab);
    });
});

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update icon
    themeIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    lucide.createIcons();
}

themeToggle.addEventListener('click', toggleTheme);

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.setAttribute('data-lucide', 'moon');
    lucide.createIcons();
}

// Command palette
function toggleCommandPalette() {
    commandPalette.classList.toggle('active');
}

closePalette.addEventListener('click', () => {
    commandPalette.classList.remove('active');
});

commandPalette.addEventListener('click', (e) => {
    if (e.target === commandPalette) {
        commandPalette.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Skip if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
            commandPalette.classList.remove('active');
        }
        return;
    }

    // Command palette toggle
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
        return;
    }

    // Close command palette
    if (e.key === 'Escape') {
        commandPalette.classList.remove('active');
        return;
    }

    // Tab shortcuts
    switch (e.key.toLowerCase()) {
        case 'p':
            switchTab('projects');
            break;
        case 't':
            switchTab('tools');
            break;
        case 'b':
            switchTab('blog');
            break;
        case 'd':
            switchTab('dayjob');
            break;
    }
});

// Sidebar resizing
let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.classList.add('resizing');
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const newWidth = e.clientX;
    if (newWidth >= 250 && newWidth <= 600) {
        sidebar.style.width = `${newWidth}px`;
    }
});

document.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        document.body.classList.remove('resizing');
    }
});

// Update commit info
function updateCommitInfo() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    commitInfo.textContent = `last updated ${formattedDate}`;
}

// Sidebar link handlers
document.querySelectorAll('.sidebar a[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.dataset.tab;
        switchTab(tabName);
    });
});

// Terminal functionality
const terminalOverlay = document.getElementById('terminal-overlay');
const terminalToggle = document.getElementById('terminal-toggle');
const terminalClose = document.getElementById('terminal-close');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalBody = document.getElementById('terminal-body');

// Command database
const commands = {
    help: {
        response: `Available commands:

  about       - Learn about Jack Ross
  projects    - View photography projects
  chicago     - Chicago Streets project
  vietnam     - Vietnam documentation (2018-2023, 2025)
  tools       - Tools and gear I use
  dayjob      - Professional work at CPGIO
  instagram   - Visit my Instagram
  portfolio   - Visit my portfolio site
  substack    - Read my writing
  contact     - Get in touch
  clear       - Clear terminal
  exit        - Close terminal

Type any question about my work for AI-powered responses.`
    },
    about: {
        response: `Jack Ross - Photographer & Growth Professional

Currently:
• Associate Director of Growth @ CPGIO (Jan 2024 - Present)
• Documenting Chicago streets
• Based in Chicago, IL

Previously:
• Lived and documented Vietnam (2018-2023)
• Built strategic partnerships at Raise, Narrative Science
• Supply chain background (Kraft Heinz, C.H. Robinson)

I blend creative street photography with business development.
Type 'projects' to see my photography work.`
    },
    projects: {
        response: `Photography Projects:

1. Chicago Streets (Ongoing)
   Documenting urban landscapes and human stories
   → https://jackjross.com/

2. Vietnam 2025
   Recent return to document new perspectives
   → https://jackjross.com/vietnam-2025

3. Vietnam 2018-2023
   Five years of cultural documentation
   → https://jackjross.com/vietnam2018-2023

Type 'chicago', 'vietnam', or visit links above.`
    },
    chicago: {
        response: `Chicago Streets (Ongoing)

Focus: Human moments and architectural interplay
Style: Street photography exploring neighborhoods

View the full gallery:
→ <a href="https://jackjross.com/" target="_blank" class="link-output">jackjross.com</a>`
    },
    vietnam: {
        response: `Vietnam Documentation

2025 Project:
New perspectives on Vietnamese culture and streets
→ <a href="https://jackjross.com/vietnam-2025" target="_blank" class="link-output">jackjross.com/vietnam-2025</a>

2018-2023 Project:
Five years of deep cultural immersion
→ <a href="https://jackjross.com/vietnam2018-2023" target="_blank" class="link-output">jackjross.com/vietnam2018-2023</a>`
    },
    tools: {
        response: `Tools & Gear:

Photography:
• Fujifilm X-Pro3
• XF 23mm F2
• Lightroom & Capture One

Digital Tools:
• Superhuman, GitHub, Claude Code
• Slack, Whispr Flow, Cursor, Replit

Workflow:
• Synology NAS
• Backblaze backup
• Dropbox Business`
    },
    dayjob: {
        response: `Professional Work:

Associate Director of Growth @ CPGIO
Jan 2024 - Present | Chicago, IL

"Partner once, sell everywhere"
Helping brands unlock growth through eCommerce.

Previous roles:
• Creative Strategist - Jack Ross Co (Vietnam)
• Senior Inside Sales - Narrative Science
• Senior AE - Raise ($100K → $1.3M)

Education: UW-Whitewater (BBA, Supply Chain)

LinkedIn: <a href="https://www.linkedin.com/in/jackjross/" target="_blank" class="link-output">linkedin.com/in/jackjross</a>`
    },
    instagram: {
        response: `Instagram: @jackjross

Follow for street photography and updates.
→ <a href="https://instagram.com/jackjross" target="_blank" class="link-output">instagram.com/jackjross</a>`
    },
    portfolio: {
        response: `Portfolio Website

View my complete photography work:
→ <a href="https://www.jackjross.com" target="_blank" class="link-output">jackjross.com</a>`
    },
    substack: {
        response: `Substack Newsletter

Thoughts on photography, travel, and creative process:
→ <a href="https://jackjross.substack.com" target="_blank" class="link-output">jackjross.substack.com</a>`
    },
    contact: {
        response: `Get in Touch:

Email: jackj.ross@gmail.com
Instagram: @jackjross
LinkedIn: linkedin.com/in/jackjross
Substack: jackjross.substack.com

I'm always open to discussing photography projects,
collaborations, or growth opportunities.`
    },
    clear: {
        action: 'clear'
    },
    exit: {
        action: 'exit'
    }
};

// Open/close terminal
function openTerminal() {
    terminalOverlay.classList.add('active');
    setTimeout(() => terminalInput.focus(), 100);
}

function closeTerminal() {
    terminalOverlay.classList.remove('active');
}

terminalToggle.addEventListener('click', openTerminal);
terminalClose.addEventListener('click', closeTerminal);

terminalOverlay.addEventListener('click', (e) => {
    if (e.target === terminalOverlay) {
        closeTerminal();
    }
});

// Process command
function processCommand(input) {
    const cmd = input.trim().toLowerCase();

    // Add command to output
    addLine(`→ ${input}`, 'command');

    if (!cmd) return;

    // Check for exact command match
    if (commands[cmd]) {
        if (commands[cmd].action === 'clear') {
            terminalOutput.innerHTML = '';
            addLine('Terminal cleared.', 'success');
        } else if (commands[cmd].action === 'exit') {
            closeTerminal();
        } else {
            addLine(commands[cmd].response);
        }
    } else {
        // AI fallback for unrecognized commands
        handleAIQuery(cmd);
    }

    addLine('');
    scrollToBottom();
}

// Add line to terminal output
function addLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = text;
    terminalOutput.appendChild(line);
}

// Scroll to bottom of terminal
function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// AI fallback handler (placeholder for API integration)
function handleAIQuery(query) {
    // Check for common question patterns
    if (query.includes('camera') || query.includes('gear') || query.includes('equipment')) {
        addLine(commands.tools.response);
    } else if (query.includes('job') || query.includes('work') || query.includes('cpgio')) {
        addLine(commands.dayjob.response);
    } else if (query.includes('photo') || query.includes('street')) {
        addLine(commands.projects.response);
    } else if (query.includes('who') || query.includes('about')) {
        addLine(commands.about.response);
    } else {
        // Fallback message
        addLine(`Command not recognized: "${query}"`, 'error');
        addLine('Type "help" for available commands.', 'info');
        addLine('');
        addLine('For AI-powered responses, an API key is required.', 'info');
        addLine('Contact me to enable advanced queries.', 'info');
    }
}

// Terminal input handler
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value;
        terminalInput.value = '';
        processCommand(input);
    }
});

// Keyboard shortcut to open terminal (backtick key)
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape' && terminalOverlay.classList.contains('active')) {
            closeTerminal();
        }
        return;
    }

    if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        if (terminalOverlay.classList.contains('active')) {
            closeTerminal();
        } else {
            openTerminal();
        }
    }

    if (e.key === 'Escape' && terminalOverlay.classList.contains('active')) {
        closeTerminal();
    }
});

// Initialize
switchTab('projects');
updateCommitInfo();

// Refresh commit info every 15 minutes
setInterval(updateCommitInfo, 15 * 60 * 1000);
