/**
 * KalaOS Workspace Template Marketplace
 *
 * Pre-built workspace templates that users can browse, preview, and apply
 * with a single click. Templates are categorized by use case.
 */

/* ──────────────────────────────────────────────
   Template Data
   ────────────────────────────────────────────── */

const WORKSPACE_TEMPLATES = [
  // ── Development ──
  {
    id: 'dev-fullstack',
    category: 'development',
    name: 'Full-Stack Dev',
    description: 'Complete full-stack development workspace with code editor, terminal, preview pane, and project manager.',
    icon: '💻',
    color: '#7c5af1',
    preview: 'Code · Terminal · Preview · Git',
    layout: {
      panels: ['code-editor', 'terminal', 'preview', 'project-manager'],
      arrangement: 'side-by-side'
    },
    tags: ['code', 'terminal', 'preview', 'git', 'full-stack'],
    popular: true
  },
  {
    id: 'dev-frontend',
    category: 'development',
    name: 'Frontend Playground',
    description: 'Live HTML/CSS/JS editing with instant preview. Perfect for prototyping UI components.',
    icon: '🎨',
    color: '#2dd4bf',
    preview: 'Editor · Live Preview · Console · Assets',
    layout: {
      panels: ['html-editor', 'css-editor', 'js-editor', 'live-preview', 'console'],
      arrangement: 'editor-preview'
    },
    tags: ['html', 'css', 'javascript', 'prototyping', 'ui'],
    popular: true
  },
  {
    id: 'dev-backend',
    category: 'development',
    name: 'Backend Studio',
    description: 'API development workspace with request builder, database explorer, and logging console.',
    icon: '⚙️',
    color: '#f0703a',
    preview: 'API Builder · DB Explorer · Logs · Testing',
    layout: {
      panels: ['api-builder', 'db-explorer', 'logs', 'test-runner'],
      arrangement: 'tabs'
    },
    tags: ['api', 'database', 'backend', 'testing', 'logs']
  },
  {
    id: 'dev-mobile',
    category: 'development',
    name: 'Mobile App Builder',
    description: 'Design and prototype mobile app interfaces with device preview and gesture testing.',
    icon: '📱',
    color: '#22c55e',
    preview: 'Canvas · Device Preview · Components · Inspector',
    layout: {
      panels: ['design-canvas', 'device-preview', 'components', 'inspector'],
      arrangement: 'side-by-side'
    },
    tags: ['mobile', 'prototype', 'design', 'components', 'preview']
  },
  {
    id: 'dev-devops',
    category: 'development',
    name: 'DevOps Dashboard',
    description: 'Monitor deployments, view logs, manage containers, and track CI/CD pipelines.',
    icon: '🚀',
    color: '#06b6d4',
    preview: 'Deployments · Containers · Logs · Metrics',
    layout: {
      panels: ['deployments', 'containers', 'logs-viewer', 'metrics'],
      arrangement: 'grid'
    },
    tags: ['devops', 'containers', 'deploy', 'monitoring', 'ci-cd']
  },

  // ── Design ──
  {
    id: 'design-ui',
    category: 'design',
    name: 'UI/UX Design Studio',
    description: 'Professional UI design workspace with layers, components, prototyping, and design tokens.',
    icon: '🖌️',
    color: '#e23270',
    preview: 'Canvas · Layers · Components · Prototype',
    layout: {
      panels: ['design-canvas', 'layers-panel', 'component-library', 'prototype'],
      arrangement: 'side-by-side'
    },
    tags: ['ui', 'ux', 'prototype', 'layers', 'components'],
    popular: true
  },
  {
    id: 'design-graphic',
    category: 'design',
    name: 'Graphic Design',
    description: 'Create social media graphics, posters, and visual content with drag-and-drop ease.',
    icon: '🖼️',
    color: '#f59e0b',
    preview: 'Canvas · Templates · Elements · Export',
    layout: {
      panels: ['design-canvas', 'templates', 'elements-panel', 'export-panel'],
      arrangement: 'side-by-side'
    },
    tags: ['graphic', 'social', 'poster', 'template', 'export']
  },
  {
    id: 'design-brand',
    category: 'design',
    name: 'Brand Identity Kit',
    description: 'Manage brand assets, color palettes, typography, and logo variations in one place.',
    icon: '🏷️',
    color: '#a855f7',
    preview: 'Colors · Typography · Logos · Assets',
    layout: {
      panels: ['color-palette', 'typography', 'logo-manager', 'asset-bank'],
      arrangement: 'grid'
    },
    tags: ['brand', 'identity', 'logo', 'colors', 'typography']
  },

  // ── Education ──
  {
    id: 'edu-classroom',
    category: 'education',
    name: 'Virtual Classroom',
    description: 'Interactive teaching workspace with slides, whiteboard, attendance, and Q&A.',
    icon: '📚',
    color: '#4ade80',
    preview: 'Slides · Whiteboard · Students · Chat',
    layout: {
      panels: ['slides', 'whiteboard', 'student-list', 'qa-chat'],
      arrangement: 'tabs'
    },
    tags: ['classroom', 'teaching', 'slides', 'whiteboard', 'interactive'],
    popular: true
  },
  {
    id: 'edu-study',
    category: 'education',
    name: 'Study Hub',
    description: 'Personal study workspace with notes, flashcards, pomodoro timer, and research tools.',
    icon: '📝',
    color: '#60a5fa',
    preview: 'Notes · Flashcards · Timer · Research',
    layout: {
      panels: ['notes', 'flashcards', 'pomodoro', 'research'],
      arrangement: 'grid'
    },
    tags: ['study', 'notes', 'flashcards', 'timer', 'research']
  },
  {
    id: 'edu-course',
    category: 'education',
    name: 'Course Creator',
    description: 'Build online courses with lesson planning, content blocks, quizzes, and student analytics.',
    icon: '🎓',
    color: '#fb923c',
    preview: 'Lessons · Content · Quizzes · Analytics',
    layout: {
      panels: ['lesson-planner', 'content-editor', 'quiz-builder', 'analytics'],
      arrangement: 'tabs'
    },
    tags: ['course', 'lesson', 'quiz', 'content', 'teaching']
  },

  // ── Productivity ──
  {
    id: 'prod-kanban',
    category: 'productivity',
    name: 'Project Kanban',
    description: 'Full project management workspace with kanban boards, sprint planning, and team timeline.',
    icon: '📋',
    color: '#7c5af1',
    preview: 'Board · Backlog · Timeline · Team',
    layout: {
      panels: ['kanban-board', 'backlog', 'timeline', 'team-view'],
      arrangement: 'tabs'
    },
    tags: ['kanban', 'project', 'sprint', 'timeline', 'team'],
    popular: true
  },
  {
    id: 'prod-note',
    category: 'productivity',
    name: 'Second Brain',
    description: 'Connected note-taking workspace with bi-directional links, tags, graph view, and daily journal.',
    icon: '🧠',
    color: '#2dd4bf',
    preview: 'Editor · Graph · Tags · Journal',
    layout: {
      panels: ['note-editor', 'graph-view', 'tag-manager', 'daily-journal'],
      arrangement: 'side-by-side'
    },
    tags: ['notes', 'graph', 'knowledge', 'journal', 'linked']
  },
  {
    id: 'prod-meeting',
    category: 'productivity',
    name: 'Meeting Hub',
    description: 'Agenda planner, live meeting notes, action items tracker, and meeting history.',
    icon: '🤝',
    color: '#f0703a',
    preview: 'Agenda · Notes · Actions · History',
    layout: {
      panels: ['agenda', 'meeting-notes', 'action-items', 'meeting-history'],
      arrangement: 'tabs'
    },
    tags: ['meeting', 'agenda', 'notes', 'actions', 'calendar']
  },

  // ── Personal ──
  {
    id: 'personal-dashboard',
    category: 'personal',
    name: 'Life Dashboard',
    description: 'Personal command center with habit tracker, goals, finances, and daily overview.',
    icon: '🌟',
    color: '#e23270',
    preview: 'Habits · Goals · Finances · Overview',
    layout: {
      panels: ['habit-tracker', 'goals', 'finances', 'daily-overview'],
      arrangement: 'grid'
    },
    tags: ['habits', 'goals', 'finance', 'dashboard', 'personal'],
    popular: true
  },
  {
    id: 'personal-fitness',
    category: 'personal',
    name: 'Fitness Tracker',
    description: 'Track workouts, nutrition, progress photos, and body measurements with charts.',
    icon: '💪',
    color: '#22c55e',
    preview: 'Workouts · Nutrition · Progress · Charts',
    layout: {
      panels: ['workout-log', 'nutrition', 'progress-photos', 'charts'],
      arrangement: 'grid'
    },
    tags: ['fitness', 'workout', 'nutrition', 'progress', 'health']
  },
  {
    id: 'personal-journal',
    category: 'personal',
    name: 'Creative Journal',
    description: 'Expressive journaling workspace with media embeds, mood tracking, and reflection prompts.',
    icon: '📖',
    color: '#a855f7',
    preview: 'Journal · Mood · Media · Prompts',
    layout: {
      panels: ['journal-editor', 'mood-tracker', 'media-embeds', 'prompts'],
      arrangement: 'side-by-side'
    },
    tags: ['journal', 'mood', 'writing', 'reflection', 'creative']
  },

  // ── Creative / Music ──
  {
    id: 'creative-music',
    category: 'creative',
    name: 'Music Production',
    description: 'Full DAW-style workspace with beat sequencer, mixer, sampler, and MIDI editor.',
    icon: '🎵',
    color: '#f0703a',
    preview: 'Sequencer · Mixer · Sampler · MIDI',
    layout: {
      panels: ['sequencer', 'mixer', 'sampler', 'midi-editor'],
      arrangement: 'tabs'
    },
    tags: ['music', 'daw', 'sequencer', 'mixer', 'midi'],
    popular: true
  },
  {
    id: 'creative-video',
    category: 'creative',
    name: 'Video Editing Suite',
    description: 'Timeline-based video editor with effects, transitions, color grading, and export.',
    icon: '🎥',
    color: '#e23270',
    preview: 'Timeline · Preview · Effects · Export',
    layout: {
      panels: ['timeline', 'preview', 'effects-panel', 'export'],
      arrangement: 'side-by-side'
    },
    tags: ['video', 'editing', 'timeline', 'effects', 'export']
  },
  {
    id: 'creative-writing',
    category: 'creative',
    name: 'Writer\'s Studio',
    description: 'Distraction-free writing environment with markdown, outline, word count goals, and research.',
    icon: '✍️',
    color: '#4ade80',
    preview: 'Editor · Outline · Goals · Research',
    layout: {
      panels: ['writing-editor', 'outline', 'word-goals', 'research'],
      arrangement: 'side-by-side'
    },
    tags: ['writing', 'markdown', 'outline', 'goals', 'focus'],
    popular: true
  },
];

/* ──────────────────────────────────────────────
   Categories
   ────────────────────────────────────────────── */

const TEMPLATE_CATEGORIES = [
  { id: 'all',          label: 'All Templates',  icon: '📐' },
  { id: 'development',  label: 'Development',    icon: '💻' },
  { id: 'design',       label: 'Design',         icon: '🎨' },
  { id: 'education',    label: 'Education',      icon: '📚' },
  { id: 'productivity', label: 'Productivity',   icon: '⚡' },
  { id: 'personal',     label: 'Personal',       icon: '🌟' },
  { id: 'creative',     label: 'Creative',       icon: '✨' },
];

/* ──────────────────────────────────────────────
   State
   ────────────────────────────────────────────── */

let _templateActiveCategory = 'all';
let _templateSearchQuery = '';

/* ──────────────────────────────────────────────
   Initialise Template Marketplace
   ────────────────────────────────────────────── */

function initTemplateMarketplace() {
  renderTemplateCategories();
  renderTemplateGrid();
  setupTemplateSearch();
}

function renderTemplateCategories() {
  const container = document.getElementById('templateCategoryList');
  if (!container) return;

  container.innerHTML = TEMPLATE_CATEGORIES.map(cat => `
    <button class="template-cat-btn ${cat.id === _templateActiveCategory ? 'active' : ''}"
            data-cat="${cat.id}"
            onclick="filterTemplatesByCategory('${cat.id}')"
            role="tab"
            aria-selected="${cat.id === _templateActiveCategory}">
      <span class="template-cat-icon" aria-hidden="true">${cat.icon}</span>
      <span class="template-cat-label">${cat.label}</span>
    </button>
  `).join('');
}

function renderTemplateGrid() {
  const container = document.getElementById('templateGrid');
  if (!container) return;

  const filtered = getFilteredTemplates();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="template-empty-state">
        <span class="template-empty-icon">🔍</span>
        <p class="template-empty-title">No templates found</p>
        <p class="template-empty-hint">Try a different category or search term.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(tpl => `
    <div class="template-card" style="--template-accent:${tpl.color}"
         onclick="showTemplatePreview('${tpl.id}')"
         role="button"
         tabindex="0"
         aria-label="${tpl.name} template">
      <div class="template-card-header">
        <span class="template-card-icon" aria-hidden="true">${tpl.icon}</span>
        ${tpl.popular ? '<span class="template-card-badge">🔥 Popular</span>' : ''}
      </div>
      <div class="template-card-body">
        <h3 class="template-card-title">${tpl.name}</h3>
        <p class="template-card-desc">${tpl.description}</p>
        <div class="template-card-preview">
          <span class="template-preview-label">Preview:</span>
          <span class="template-preview-text">${tpl.preview}</span>
        </div>
        <div class="template-card-tags">
          ${tpl.tags.slice(0, 4).map(t => `<span class="template-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="template-card-footer">
        <button class="btn-primary template-apply-btn" onclick="event.stopPropagation(); applyWorkspaceTemplate('${tpl.id}')">
          ✦ Apply Template
        </button>
      </div>
    </div>
  `).join('');
}

function getFilteredTemplates() {
  let list = WORKSPACE_TEMPLATES;

  // Category filter
  if (_templateActiveCategory !== 'all') {
    list = list.filter(t => t.category === _templateActiveCategory);
  }

  // Search filter
  if (_templateSearchQuery.trim()) {
    const q = _templateSearchQuery.toLowerCase().trim();
    list = list.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
    );
  }

  return list;
}

function setupTemplateSearch() {
  const input = document.getElementById('templateSearchInput');
  if (!input) return;

  input.addEventListener('input', (e) => {
    _templateSearchQuery = e.target.value;
    renderTemplateGrid();
  });
}

function filterTemplatesByCategory(catId) {
  _templateActiveCategory = catId;
  renderTemplateCategories();
  renderTemplateGrid();

  // Scroll to grid
  const grid = document.getElementById('templateGrid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearTemplateFilters() {
  _templateActiveCategory = 'all';
  _templateSearchQuery = '';
  const input = document.getElementById('templateSearchInput');
  if (input) input.value = '';
  renderTemplateCategories();
  renderTemplateGrid();
}

/* ──────────────────────────────────────────────
   Template Preview (Quick View)
   ────────────────────────────────────────────── */

function showTemplatePreview(templateId) {
  const tpl = WORKSPACE_TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return;

  const modal = document.getElementById('templatePreviewModal');
  if (!modal) return;

  // Populate modal
  document.getElementById('tplPreviewIcon').textContent = tpl.icon;
  document.getElementById('tplPreviewName').textContent = tpl.name;
  document.getElementById('tplPreviewDesc').textContent = tpl.description;
  document.getElementById('tplPreviewLayout').textContent = tpl.layout.arrangement.replace(/-/g, ' ');
  document.getElementById('tplPreviewPanels').textContent = tpl.layout.panels.map(p =>
    p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  ).join(' · ');
  document.getElementById('tplPreviewTags').innerHTML = tpl.tags.map(t =>
    `<span class="template-tag">${t}</span>`
  ).join('');
  document.getElementById('tplPreviewCategory').textContent =
    TEMPLATE_CATEGORIES.find(c => c.id === tpl.category)?.label || tpl.category;
  document.getElementById('tplPreviewColor').style.background = tpl.color;

  // Set accent color
  modal.style.setProperty('--preview-accent', tpl.color);

  // Bind apply button
  const applyBtn = document.getElementById('tplPreviewApplyBtn');
  applyBtn.onclick = () => {
    applyWorkspaceTemplate(tpl.id);
    closeTemplatePreview();
  };

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeTemplatePreview() {
  const modal = document.getElementById('templatePreviewModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/* ──────────────────────────────────────────────
   Apply a Workspace Template
   ────────────────────────────────────────────── */

function applyWorkspaceTemplate(templateId) {
  const tpl = WORKSPACE_TEMPLATES.find(t => t.id === templateId);
  if (!tpl) {
    showTemplateStatus('Template not found.', true);
    return;
  }

  // Save the applied template to localStorage
  const applied = JSON.parse(localStorage.getItem('kala-applied-template') || '{}');
  applied.id = tpl.id;
  applied.name = tpl.name;
  applied.icon = tpl.icon;
  applied.date = new Date().toISOString();
  localStorage.setItem('kala-applied-template', JSON.stringify(applied));

  // Show success animation and message
  showTemplateStatus(`✨ "${tpl.name}" template applied! Your workspace has been configured.`, false);

  // Update the active template indicator
  const indicator = document.getElementById('activeTemplateIndicator');
  if (indicator) {
    indicator.innerHTML = `
      <span class="active-template-badge">
        <span aria-hidden="true">${tpl.icon}</span>
        <span>${tpl.name}</span>
        <button class="btn-ghost-sm" onclick="clearAppliedTemplate()" title="Clear template" aria-label="Clear applied template">✕</button>
      </span>
    `;
  }

  // Switch to dashboard to show the applied template
  if (typeof switchStudio === 'function') {
    // Show a brief toast/notification
    const toast = document.createElement('div');
    toast.className = 'template-toast';
    toast.innerHTML = `
      <span class="template-toast-icon" aria-hidden="true">✅</span>
      <div class="template-toast-content">
        <strong>${tpl.icon} ${tpl.name}</strong>
        <span>Workspace template applied successfully</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('template-toast-show'), 10);
    setTimeout(() => {
      toast.classList.remove('template-toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

function clearAppliedTemplate() {
  localStorage.removeItem('kala-applied-template');
  const indicator = document.getElementById('activeTemplateIndicator');
  if (indicator) indicator.innerHTML = '';
  showTemplateStatus('Template cleared. Your workspace has been reset to default.', false);
}

function loadAppliedTemplate() {
  const applied = JSON.parse(localStorage.getItem('kala-applied-template') || '{}');
  if (applied.id) {
    const indicator = document.getElementById('activeTemplateIndicator');
    if (indicator) {
      indicator.innerHTML = `
        <span class="active-template-badge">
          <span aria-hidden="true">${applied.icon || '📐'}</span>
          <span>${applied.name}</span>
          <button class="btn-ghost-sm" onclick="clearAppliedTemplate()" title="Clear template" aria-label="Clear applied template">✕</button>
        </span>
      `;
    }
  }
}

/* ──────────────────────────────────────────────
   Status Messages
   ────────────────────────────────────────────── */

function showTemplateStatus(msg, isError) {
  const el = document.getElementById('templateStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = 'template-status' + (isError ? ' template-status-error' : ' template-status-success');
  el.classList.remove('hidden');
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => el.classList.add('hidden'), 4000);
}