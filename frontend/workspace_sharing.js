/**
 * KalaOS — Workspace Sharing with Role-Based Permissions
 *
 * Allows workspace owners to invite collaborators, assign roles (Viewer / Editor / Admin),
 * revoke access, and view the current member list.
 *
 * All data is stored in localStorage — nothing is sent to any server.
 * localStorage key: 'kala-workspaces'
 */

/* ──────────────────────────────────────────────
   Constants & Roles
────────────────────────────────────────────── */

const _WSH_STORAGE_KEY = 'kala-workspaces';

const _WSH_ROLES = {
  viewer: { label: 'Viewer',  icon: '👁️',  rank: 1, canEdit: false, canInvite: false, canRevoke: false },
  editor: { label: 'Editor',  icon: '✏️',  rank: 2, canEdit: true,  canInvite: false, canRevoke: false },
  admin:  { label: 'Admin',   icon: '🛡️',  rank: 3, canEdit: true,  canInvite: true,  canRevoke: true  },
  owner:  { label: 'Owner',   icon: '👑',  rank: 4, canEdit: true,  canInvite: true,  canRevoke: true  },
};

/* ──────────────────────────────────────────────
   Storage Helpers
────────────────────────────────────────────── */

function _wshLoad() {
  try { return JSON.parse(localStorage.getItem(_WSH_STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function _wshSave(workspaces) {
  localStorage.setItem(_WSH_STORAGE_KEY, JSON.stringify(workspaces));
}

function _wshCurrentUserEmail() {
  try {
    const token = localStorage.getItem('kala-auth-token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || payload.sub || null;
  } catch { return null; }
}

/* ──────────────────────────────────────────────
   Workspace CRUD
────────────────────────────────────────────── */

/**
 * Create a new workspace owned by the current user.
 * @param {string} name
 * @returns {object} workspace
 */
function wshCreateWorkspace(name) {
  const email = _wshCurrentUserEmail();
  if (!email) { showToast('Sign in to create a workspace.'); return null; }
  const ws = {
    id: 'ws_' + Date.now().toString(36),
    name: name.trim(),
    createdAt: Date.now(),
    archivedAt: null,
    members: [{ email, role: 'owner', joinedAt: Date.now() }],
  };
  const all = _wshLoad();
  all.push(ws);
  _wshSave(all);
  return ws;
}

/**
 * Return active (non-archived) workspaces the current user is a member of.
 */
function wshMyWorkspaces() {
  const email = _wshCurrentUserEmail();
  if (!email) return [];
  return _wshLoad().filter(ws => !ws.archivedAt && ws.members.some(m => m.email === email));
}

/**
 * Return archived workspaces the current user owns.
 */
function wshArchivedWorkspaces() {
  const email = _wshCurrentUserEmail();
  if (!email) return [];
  return _wshLoad().filter(ws => ws.archivedAt && ws.members.some(m => m.email === email && m.role === 'owner'));
}

/**
 * Get a single workspace by id (only if current user is a member).
 */
function wshGetWorkspace(id) {
  const email = _wshCurrentUserEmail();
  const ws = _wshLoad().find(w => w.id === id);
  if (!ws || !ws.members.some(m => m.email === email)) return null;
  return ws;
}

/* ──────────────────────────────────────────────
   Archive / Restore / Delete
────────────────────────────────────────────── */

/**
 * Archive a workspace (owner only). Sets archivedAt timestamp.
 * @param {string} wsId
 * @returns {{ ok: boolean, message: string }}
 */
function wshArchive(wsId) {
  const all = _wshLoad();
  const ws  = all.find(w => w.id === wsId);
  if (!ws) return { ok: false, message: 'Workspace not found.' };
  if (_wshMyRole(ws) !== 'owner') return { ok: false, message: 'Only the owner can archive a workspace.' };
  if (ws.archivedAt) return { ok: false, message: 'Workspace is already archived.' };
  ws.archivedAt = Date.now();
  _wshSave(all);
  return { ok: true, message: `"${ws.name}" archived.` };
}

/**
 * Restore an archived workspace (owner only). Clears archivedAt.
 * @param {string} wsId
 * @returns {{ ok: boolean, message: string }}
 */
function wshRestore(wsId) {
  const all = _wshLoad();
  const ws  = all.find(w => w.id === wsId);
  if (!ws) return { ok: false, message: 'Workspace not found.' };
  if (_wshMyRole(ws) !== 'owner') return { ok: false, message: 'Only the owner can restore a workspace.' };
  if (!ws.archivedAt) return { ok: false, message: 'Workspace is not archived.' };
  ws.archivedAt = null;
  _wshSave(all);
  return { ok: true, message: `"${ws.name}" restored.` };
}

/**
 * Permanently delete a workspace (owner only, must be archived first).
 * @param {string} wsId
 * @returns {{ ok: boolean, message: string }}
 */
function wshDeletePermanently(wsId) {
  const all = _wshLoad();
  const ws  = all.find(w => w.id === wsId);
  if (!ws) return { ok: false, message: 'Workspace not found.' };
  if (_wshMyRole(ws) !== 'owner') return { ok: false, message: 'Only the owner can delete a workspace.' };
  if (!ws.archivedAt) return { ok: false, message: 'Archive the workspace before deleting it permanently.' };
  const updated = all.filter(w => w.id !== wsId);
  _wshSave(updated);
  return { ok: true, message: `"${ws.name}" permanently deleted.` };
}

/* ──────────────────────────────────────────────
   Permission Helpers
────────────────────────────────────────────── */

function _wshMyRole(ws) {
  const email = _wshCurrentUserEmail();
  const member = ws.members.find(m => m.email === email);
  return member ? member.role : null;
}

function _wshCan(ws, permission) {
  const role = _wshMyRole(ws);
  return role ? (_WSH_ROLES[role]?.[permission] ?? false) : false;
}

/* ──────────────────────────────────────────────
   Invite / Role Change / Revoke
────────────────────────────────────────────── */

/**
 * Invite a user to a workspace with a given role.
 * @param {string} wsId
 * @param {string} inviteeEmail
 * @param {'viewer'|'editor'|'admin'} role
 * @returns {{ ok: boolean, message: string }}
 */
function wshInvite(wsId, inviteeEmail, role) {
  const email = inviteeEmail.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }
  if (!_WSH_ROLES[role] || role === 'owner') {
    return { ok: false, message: 'Invalid role. Choose Viewer, Editor, or Admin.' };
  }
  const all = _wshLoad();
  const ws  = all.find(w => w.id === wsId);
  if (!ws) return { ok: false, message: 'Workspace not found.' };
  if (!_wshCan(ws, 'canInvite')) {
    return { ok: false, message: 'You do not have permission to invite members.' };
  }
  if (ws.members.some(m => m.email === email)) {
    return { ok: false, message: `${email} is already a member.` };
  }
  ws.members.push({ email, role, joinedAt: Date.now() });
  _wshSave(all);
  return { ok: true, message: `${email} invited as ${_WSH_ROLES[role].label}.` };
}

/**
 * Change a member's role.
 * @param {string} wsId
 * @param {string} targetEmail
 * @param {'viewer'|'editor'|'admin'} newRole
 */
function wshChangeRole(wsId, targetEmail, newRole) {
  if (!_WSH_ROLES[newRole] || newRole === 'owner') {
    return { ok: false, message: 'Invalid role.' };
  }
  const all = _wshLoad();
  const ws  = all.find(w => w.id === wsId);
  if (!ws) return { ok: false, message: 'Workspace not found.' };
  if (!_wshCan(ws, 'canRevoke')) {
    return { ok: false, message: 'You do not have permission to change roles.' };
  }
  const member = ws.members.find(m => m.email === targetEmail);
  if (!member) return { ok: false, message: 'Member not found.' };
  if (member.role === 'owner') return { ok: false, message: 'Cannot change the owner\'s role.' };
  member.role = newRole;
  _wshSave(all);
  return { ok: true, message: `Role updated to ${_WSH_ROLES[newRole].label}.` };
}

/**
 * Revoke a member's access.
 * @param {string} wsId
 * @param {string} targetEmail
 */
function wshRevoke(wsId, targetEmail) {
  const all = _wshLoad();
  const ws  = all.find(w => w.id === wsId);
  if (!ws) return { ok: false, message: 'Workspace not found.' };
  if (!_wshCan(ws, 'canRevoke')) {
    return { ok: false, message: 'You do not have permission to revoke access.' };
  }
  const member = ws.members.find(m => m.email === targetEmail);
  if (!member) return { ok: false, message: 'Member not found.' };
  if (member.role === 'owner') return { ok: false, message: 'Cannot remove the workspace owner.' };
  ws.members = ws.members.filter(m => m.email !== targetEmail);
  _wshSave(all);
  return { ok: true, message: `${targetEmail} removed from workspace.` };
}

/* ──────────────────────────────────────────────
   UI State
────────────────────────────────────────────── */

let _wshActiveWsId  = null;
let _wshListTab     = 'active'; // 'active' | 'archived'

function openWorkspaceSharing() {
  const panel = document.getElementById('wshPanel');
  if (!panel) return;
  _wshActiveWsId = null;
  _wshListTab    = 'active';
  _wshRenderWorkspaceList();
  panel.classList.remove('hidden');
}

function closeWorkspaceSharing() {
  const panel = document.getElementById('wshPanel');
  if (panel) panel.classList.add('hidden');
  _wshActiveWsId = null;
}

/* ──────────────────────────────────────────────
   Rendering — Workspace List
────────────────────────────────────────────── */

function _wshRenderWorkspaceList() {
  const container = document.getElementById('wshContent');
  if (!container) return;

  const active   = wshMyWorkspaces();
  const archived = wshArchivedWorkspaces();
  const showActive = _wshListTab === 'active';
  const list = showActive ? active : archived;

  container.innerHTML = `
    <div class="wsh-section">
      <div class="wsh-section-header">
        <span class="wsh-section-title">Workspaces</span>
        ${showActive ? `<button class="btn-primary wsh-btn-sm" onclick="_wshShowCreateForm()">\uFF0B New Workspace</button>` : ''}
      </div>

      <div class="wsh-tabs" role="tablist">
        <button class="wsh-tab${showActive ? ' wsh-tab-active' : ''}" onclick="_wshSwitchTab('active')" role="tab">Active ${active.length > 0 ? `<span class="wsh-tab-count">${active.length}</span>` : ''}</button>
        <button class="wsh-tab${!showActive ? ' wsh-tab-active' : ''}" onclick="_wshSwitchTab('archived')" role="tab">Archived ${archived.length > 0 ? `<span class="wsh-tab-count wsh-tab-count-archived">${archived.length}</span>` : ''}</button>
        <button class="wsh-tab" onclick="_wshSwitchTab('import-export')" role="tab">↕ Import / Export</button>
      </div>

      <div id="wshCreateForm" class="wsh-create-form hidden">
        <input type="text" id="wshNewName" class="wsh-input" placeholder="Workspace name\u2026" autocomplete="off" />
        <div class="wsh-form-actions">
          <button class="btn-primary wsh-btn-sm" onclick="_wshSubmitCreate()">Create</button>
          <button class="btn-ghost wsh-btn-sm" onclick="_wshHideCreateForm()">Cancel</button>
        </div>
      </div>

      ${list.length === 0
        ? `<p class="wsh-empty">${showActive
            ? 'No active workspaces. Create one to start collaborating.'
            : 'No archived workspaces.'}</p>`
        : list.map(ws => {
            const myRole   = _wshMyRole(ws);
            const roleInfo = _WSH_ROLES[myRole] || {};
            if (!showActive) {
              // Archived card
              return `
                <div class="wsh-workspace-card wsh-workspace-archived">
                  <div class="wsh-ws-info">
                    <div class="wsh-ws-name-row">
                      <span class="wsh-ws-name">${esc(ws.name)}</span>
                      <span class="wsh-archived-badge">\uD83D\uDDC4\uFE0F Archived</span>
                    </div>
                    <span class="wsh-ws-meta">Archived ${_wshFormatDate(ws.archivedAt)} &middot; ${ws.members.length} member${ws.members.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div class="wsh-ws-card-actions">
                    <button class="btn-ghost wsh-btn-sm" onclick="_wshSubmitRestore('${ws.id}')" title="Restore workspace">\u21A9 Restore</button>
                    <button class="wsh-delete-btn wsh-btn-sm" onclick="_wshSubmitDelete('${ws.id}')" title="Permanently delete">\uD83D\uDDD1 Delete</button>
                  </div>
                </div>`;
            }
            // Active card
            return `
              <div class="wsh-workspace-card">
                <div class="wsh-ws-info" onclick="_wshOpenWorkspace('${ws.id}')" style="cursor:pointer;flex:1">
                  <span class="wsh-ws-name">${esc(ws.name)}</span>
                  <span class="wsh-ws-meta">${ws.members.length} member${ws.members.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="wsh-ws-card-actions">
                  <span class="wsh-role-badge wsh-role-${myRole}">${roleInfo.icon || ''} ${roleInfo.label || myRole}</span>
                  ${myRole === 'owner' ? `<button class="btn-ghost wsh-btn-sm" onclick="_wshSubmitArchive('${ws.id}')" title="Archive workspace">\uD83D\uDDC4\uFE0F Archive</button>` : ''}
                </div>
              </div>`;
          }).join('')
      }
    </div>`;
}

function _wshSwitchTab(tab) {
  _wshListTab = tab;
  if (tab === 'import-export') { _wshRenderImportExport(); return; }
  _wshRenderWorkspaceList();
}

/* ──────────────────────────────────────────────
   Rendering — Workspace Detail (Members)
────────────────────────────────────────────── */

function _wshOpenWorkspace(wsId) {
  _wshActiveWsId = wsId;
  const ws = wshGetWorkspace(wsId);
  if (!ws) { showToast('Workspace not found.'); return; }
  _wshRenderDetail(ws);
}

function _wshRenderDetail(ws) {
  const container = document.getElementById('wshContent');
  if (!container) return;

  const myRole    = _wshMyRole(ws);
  const canInvite = _wshCan(ws, 'canInvite');
  const canRevoke = _wshCan(ws, 'canRevoke');
  const isOwner   = myRole === 'owner';
  const isArchived = !!ws.archivedAt;

  container.innerHTML = `
    <div class="wsh-section">
      <div class="wsh-section-header">
        <button class="btn-ghost wsh-btn-sm" onclick="_wshRenderWorkspaceList()">← Back</button>
        <span class="wsh-section-title">${esc(ws.name)}</span>
        ${isArchived ? `<span class="wsh-archived-badge">🗄\uFE0F Archived</span>` : ''}
        <span class="wsh-ws-id-badge" title="Workspace ID">${esc(ws.id)}</span>
      </div>

      ${isOwner ? `
      <div class="wsh-danger-zone">
        ${!isArchived
          ? `<button class="btn-ghost wsh-btn-sm" onclick="_wshSubmitArchive('${ws.id}')">🗄\uFE0F Archive Workspace</button>`
          : `<button class="btn-ghost wsh-btn-sm" onclick="_wshSubmitRestore('${ws.id}')">↩ Restore Workspace</button>
             <button class="wsh-delete-btn wsh-btn-sm" onclick="_wshSubmitDelete('${ws.id}')">🗑 Delete Permanently</button>`
        }
      </div>` : ''}

      ${canInvite && !isArchived ? `
      <div class="wsh-invite-form">
        <h4 class="wsh-form-title">Invite a collaborator</h4>
        <div class="wsh-invite-row">
          <input type="email" id="wshInviteEmail" class="wsh-input" placeholder="artist@example.com" autocomplete="off" />
          <select id="wshInviteRole" class="wsh-select">
            <option value="viewer">👁\uFE0F Viewer</option>
            <option value="editor" selected>✏\uFE0F Editor</option>
            <option value="admin">🛡\uFE0F Admin</option>
          </select>
          <button class="btn-primary wsh-btn-sm" onclick="_wshSubmitInvite('${ws.id}')">Send Invite</button>
        </div>
        <div id="wshInviteStatus" class="wsh-status" aria-live="polite"></div>
      </div>` : ''}

      <h4 class="wsh-form-title">Members (${ws.members.length})</h4>
      <div class="wsh-members-list">
        ${ws.members.map(m => {
          const roleInfo = _WSH_ROLES[m.role] || {};
          const isOwnerMember = m.role === 'owner';
          const canAct = canRevoke && !isOwnerMember && !isArchived;
          return `
            <div class="wsh-member-row">
              <div class="wsh-member-avatar">${(m.email[0] || '?').toUpperCase()}</div>
              <div class="wsh-member-info">
                <span class="wsh-member-email">${esc(m.email)}</span>
                <span class="wsh-member-joined">Joined ${_wshFormatDate(m.joinedAt)}</span>
              </div>
              <div class="wsh-member-controls">
                ${canAct ? `
                  <select class="wsh-select wsh-role-select" onchange="_wshSubmitRoleChange('${ws.id}','${esc(m.email)}',this.value)">
                    <option value="viewer"  ${m.role === 'viewer'  ? 'selected' : ''}>👁\uFE0F Viewer</option>
                    <option value="editor"  ${m.role === 'editor'  ? 'selected' : ''}>✏\uFE0F Editor</option>
                    <option value="admin"   ${m.role === 'admin'   ? 'selected' : ''}>🛡\uFE0F Admin</option>
                  </select>
                  <button class="wsh-revoke-btn" onclick="_wshSubmitRevoke('${ws.id}','${esc(m.email)}')" title="Remove member">✕</button>
                ` : `<span class="wsh-role-badge wsh-role-${m.role}">${roleInfo.icon || ''} ${roleInfo.label || m.role}</span>`}
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

/* ──────────────────────────────────────────────
   UI Action Handlers
────────────────────────────────────────────── */

function _wshSubmitArchive(wsId) {
  const result = wshArchive(wsId);
  showToast(result.message);
  if (result.ok) _wshRenderWorkspaceList();
}

function _wshSubmitRestore(wsId) {
  const result = wshRestore(wsId);
  showToast(result.message);
  if (result.ok) { _wshListTab = 'active'; _wshRenderWorkspaceList(); }
}

function _wshSubmitDelete(wsId) {
  const ws = wshGetWorkspace(wsId);
  if (!ws) return;
  if (!confirm(`Permanently delete "${ws.name}"? This cannot be undone.`)) return;
  const result = wshDeletePermanently(wsId);
  showToast(result.message);
  if (result.ok) _wshRenderWorkspaceList();
}

function _wshShowCreateForm() {
  const form = document.getElementById('wshCreateForm');
  if (form) { form.classList.remove('hidden'); document.getElementById('wshNewName')?.focus(); }
}

function _wshHideCreateForm() {
  const form = document.getElementById('wshCreateForm');
  if (form) form.classList.add('hidden');
}

function _wshSubmitCreate() {
  const input = document.getElementById('wshNewName');
  const name  = (input?.value || '').trim();
  if (!name) { showToast('Enter a workspace name.'); return; }
  const ws = wshCreateWorkspace(name);
  if (ws) {
    showToast(`Workspace "${ws.name}" created.`);
    _wshRenderWorkspaceList();
  }
}

function _wshSubmitInvite(wsId) {
  const email  = (document.getElementById('wshInviteEmail')?.value || '').trim();
  const role   = document.getElementById('wshInviteRole')?.value || 'editor';
  const status = document.getElementById('wshInviteStatus');
  const result = wshInvite(wsId, email, role);
  if (status) {
    status.textContent = result.message;
    status.className   = 'wsh-status ' + (result.ok ? 'wsh-status-ok' : 'wsh-status-err');
  }
  if (result.ok) {
    if (document.getElementById('wshInviteEmail')) document.getElementById('wshInviteEmail').value = '';
    const ws = wshGetWorkspace(wsId);
    if (ws) _wshRenderDetail(ws);
    showToast(result.message);
  }
}

function _wshSubmitRoleChange(wsId, targetEmail, newRole) {
  const result = wshChangeRole(wsId, targetEmail, newRole);
  showToast(result.message);
  if (result.ok) {
    const ws = wshGetWorkspace(wsId);
    if (ws) _wshRenderDetail(ws);
  }
}

function _wshSubmitRevoke(wsId, targetEmail) {
  if (!confirm(`Remove ${targetEmail} from this workspace?`)) return;
  const result = wshRevoke(wsId, targetEmail);
  showToast(result.message);
  if (result.ok) {
    const ws = wshGetWorkspace(wsId);
    if (ws) _wshRenderDetail(ws);
    else _wshRenderWorkspaceList();
  }
}

/* ──────────────────────────────────────────────
   Import / Export
────────────────────────────────────────────── */

const _WSH_EXPORT_VERSION = 1;

/**
 * Export a single workspace as a downloaded JSON file.
 * @param {string} wsId
 */
function wshExportOne(wsId) {
  const ws = wshGetWorkspace(wsId);
  if (!ws) { showToast('Workspace not found.'); return; }
  _wshDownloadJson(
    { version: _WSH_EXPORT_VERSION, exportedAt: Date.now(), workspaces: [ws] },
    `kalaos-workspace-${ws.id}.json`
  );
  showToast(`"${ws.name}" exported.`);
}

/**
 * Export all workspaces the current user owns as a single JSON bundle.
 */
function wshExportAll() {
  const email = _wshCurrentUserEmail();
  if (!email) { showToast('Sign in to export workspaces.'); return; }
  const owned = _wshLoad().filter(ws => ws.members.some(m => m.email === email && m.role === 'owner'));
  if (owned.length === 0) { showToast('No workspaces to export.'); return; }
  _wshDownloadJson(
    { version: _WSH_EXPORT_VERSION, exportedAt: Date.now(), workspaces: owned },
    `kalaos-workspaces-${Date.now()}.json`
  );
  showToast(`${owned.length} workspace${owned.length !== 1 ? 's' : ''} exported.`);
}

/**
 * Validate a parsed import payload.
 * @param {any} data
 * @returns {{ ok: boolean, errors: string[], workspaces: object[] }}
 */
function wshValidateImport(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { ok: false, errors: ['File is not a valid JSON object.'], workspaces: [] };
  }
  if (data.version !== _WSH_EXPORT_VERSION) {
    errors.push(`Unsupported export version: ${data.version ?? 'missing'}. Expected ${_WSH_EXPORT_VERSION}.`);
  }
  if (!Array.isArray(data.workspaces) || data.workspaces.length === 0) {
    errors.push('No workspaces array found in file.');
    return { ok: false, errors, workspaces: [] };
  }
  const valid = [];
  data.workspaces.forEach((ws, i) => {
    const prefix = `Workspace #${i + 1}`;
    if (typeof ws.id !== 'string' || !ws.id.startsWith('ws_')) {
      errors.push(`${prefix}: missing or invalid id.`); return;
    }
    if (typeof ws.name !== 'string' || !ws.name.trim()) {
      errors.push(`${prefix}: missing name.`); return;
    }
    if (!Array.isArray(ws.members) || ws.members.length === 0) {
      errors.push(`${prefix}: members array is empty or missing.`); return;
    }
    const hasOwner = ws.members.some(m => m.role === 'owner' && typeof m.email === 'string');
    if (!hasOwner) {
      errors.push(`${prefix}: no owner member found.`); return;
    }
    const invalidRole = ws.members.find(m => !_WSH_ROLES[m.role]);
    if (invalidRole) {
      errors.push(`${prefix}: member "${invalidRole.email}" has unknown role "${invalidRole.role}".`); return;
    }
    valid.push(ws);
  });
  return { ok: errors.length === 0, errors, workspaces: valid };
}

/**
 * Import workspaces from a validated payload.
 * Duplicate ids are skipped; name collisions get a " (imported)" suffix.
 * @param {object[]} incoming  — validated workspace objects
 * @returns {{ added: number, skipped: number }}
 */
function wshImportWorkspaces(incoming) {
  const all    = _wshLoad();
  const ids    = new Set(all.map(w => w.id));
  const names  = new Set(all.map(w => w.name.toLowerCase()));
  let added = 0, skipped = 0;
  incoming.forEach(ws => {
    if (ids.has(ws.id)) { skipped++; return; }
    // Resolve name collision
    let name = ws.name;
    if (names.has(name.toLowerCase())) name = name + ' (imported)';
    all.push({ ...ws, name, importedAt: Date.now() });
    ids.add(ws.id);
    names.add(name.toLowerCase());
    added++;
  });
  _wshSave(all);
  return { added, skipped };
}

/* ──────────────────────────────────────────────
   Import / Export UI
────────────────────────────────────────────── */

function _wshRenderImportExport() {
  const container = document.getElementById('wshContent');
  if (!container) return;

  const active   = wshMyWorkspaces();
  const archived = wshArchivedWorkspaces();
  const allOwned = _wshLoad().filter(ws => {
    const email = _wshCurrentUserEmail();
    return email && ws.members.some(m => m.email === email && m.role === 'owner');
  });

  container.innerHTML = `
    <div class="wsh-section">
      <div class="wsh-section-header">
        <span class="wsh-section-title">Workspaces</span>
      </div>

      <div class="wsh-tabs" role="tablist">
        <button class="wsh-tab" onclick="_wshSwitchTab('active')" role="tab">Active ${active.length > 0 ? `<span class="wsh-tab-count">${active.length}</span>` : ''}</button>
        <button class="wsh-tab" onclick="_wshSwitchTab('archived')" role="tab">Archived ${archived.length > 0 ? `<span class="wsh-tab-count wsh-tab-count-archived">${archived.length}</span>` : ''}</button>
        <button class="wsh-tab wsh-tab-active" role="tab">Import / Export</button>
      </div>

      <!-- Export section -->
      <div class="wsh-ie-block">
        <h4 class="wsh-form-title">Export</h4>
        <p class="wsh-ie-hint">Download your workspace configurations as JSON. You can re-import them on any device.</p>
        <div class="wsh-ie-actions">
          <button class="btn-primary wsh-btn-sm" onclick="wshExportAll()" ${allOwned.length === 0 ? 'disabled' : ''}>⬇ Export All (${allOwned.length})</button>
        </div>
        ${allOwned.length > 0 ? `
        <div class="wsh-ie-ws-list">
          ${allOwned.map(ws => `
            <div class="wsh-ie-ws-row">
              <span class="wsh-ie-ws-name">${esc(ws.name)}</span>
              <button class="btn-ghost wsh-btn-sm" onclick="wshExportOne('${ws.id}')">⬇ Export</button>
            </div>`).join('')}
        </div>` : ''}
      </div>

      <!-- Import section -->
      <div class="wsh-ie-block">
        <h4 class="wsh-form-title">Import</h4>
        <p class="wsh-ie-hint">Select a previously exported <code>.json</code> file. Duplicate workspaces are skipped automatically.</p>
        <div class="wsh-ie-drop-zone" id="wshDropZone"
          onclick="document.getElementById('wshFileInput').click()"
          ondragover="event.preventDefault();this.classList.add('wsh-drop-active')"
          ondragleave="this.classList.remove('wsh-drop-active')"
          ondrop="_wshHandleDrop(event)">
          <span class="wsh-ie-drop-icon">📂</span>
          <span class="wsh-ie-drop-label">Click or drag &amp; drop a <strong>.json</strong> file here</span>
          <input type="file" id="wshFileInput" accept=".json,application/json" style="display:none" onchange="_wshHandleFileInput(this)" />
        </div>
        <div id="wshImportStatus" class="wsh-import-status hidden" aria-live="polite"></div>
      </div>
    </div>`;
}

function _wshHandleDrop(e) {
  e.preventDefault();
  document.getElementById('wshDropZone')?.classList.remove('wsh-drop-active');
  const file = e.dataTransfer?.files?.[0];
  if (file) _wshProcessImportFile(file);
}

function _wshHandleFileInput(input) {
  const file = input?.files?.[0];
  if (file) _wshProcessImportFile(file);
  input.value = '';
}

function _wshProcessImportFile(file) {
  const status = document.getElementById('wshImportStatus');
  if (!file.name.endsWith('.json') && file.type !== 'application/json') {
    _wshShowImportStatus(false, ['Only .json files are supported.']);
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    let parsed;
    try { parsed = JSON.parse(e.target.result); }
    catch { _wshShowImportStatus(false, ['File contains invalid JSON.']); return; }
    const { ok, errors, workspaces } = wshValidateImport(parsed);
    if (!ok || workspaces.length === 0) {
      _wshShowImportStatus(false, errors.length ? errors : ['No valid workspaces found in file.']);
      return;
    }
    const { added, skipped } = wshImportWorkspaces(workspaces);
    const msg = `${added} workspace${added !== 1 ? 's' : ''} imported${skipped > 0 ? `, ${skipped} skipped (already exist)` : ''}.`;
    _wshShowImportStatus(true, [msg]);
    showToast(msg);
    // Refresh the export list to reflect newly imported workspaces
    setTimeout(_wshRenderImportExport, 300);
  };
  reader.onerror = () => _wshShowImportStatus(false, ['Could not read file.']);
  reader.readAsText(file);
}

function _wshShowImportStatus(ok, lines) {
  const el = document.getElementById('wshImportStatus');
  if (!el) return;
  el.className = 'wsh-import-status ' + (ok ? 'wsh-import-ok' : 'wsh-import-err');
  el.innerHTML = lines.map(l => `<div>${esc(l)}</div>`).join('');
  el.classList.remove('hidden');
}

/* ──────────────────────────────────────────────
   Utility
────────────────────────────────────────────── */

function _wshDownloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function _wshFormatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
