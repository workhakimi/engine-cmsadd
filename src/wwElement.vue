<template>
  <div class="gdm-cms" :style="cssVars">

    <!-- ═══════════════════════════════════════════════
         ADMIN MODE
    ════════════════════════════════════════════════ -->
    <div v-if="isAdmin">

      <div class="gdm-cms__admin-header">
        <div class="gdm-cms__admin-header-left">
          <span class="gdm-cms__admin-badge">Admin</span>
          <h2 class="gdm-cms__admin-title">CMS Manager</h2>
        </div>
        <button type="button" class="gdm-cms__btn gdm-cms__btn--primary" @click="toggleForm">
          {{ formVisible ? '✕ Close' : '+ New Item' }}
        </button>
      </div>

      <div v-if="formVisible" class="gdm-cms__form-wrap">
        <div class="gdm-cms__form-card" :style="cardStyles">
          <div class="gdm-cms__form-card-header">
            <h3 class="gdm-cms__form-title">{{ editingId ? 'Edit Item' : 'New CMS Item' }}</h3>
            <span v-if="editingId" class="gdm-cms__editing-badge">editing</span>
          </div>
          <form class="gdm-cms__form" @submit.prevent="handleSubmit">
            <div class="gdm-cms__section">
              <p class="gdm-cms__section-label">Basic Info</p>
              <div class="gdm-cms__grid-2">
                <div v-if="clients.length > 0" class="gdm-cms__field">
                  <label class="gdm-cms__label">Client</label>
                  <select v-model="form.clientId" class="gdm-cms__select" :style="inputBaseStyles">
                    <option value="">Select client</option>
                    <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.company_name || c.contact_name || c.id }}</option>
                  </select>
                </div>
                <div class="gdm-cms__field">
                  <label class="gdm-cms__label">Type <span class="gdm-cms__required">*</span></label>
                  <input v-model="form.type" type="text" class="gdm-cms__input" :style="inputBaseStyles" placeholder="changelog, article, documentation…" />
                </div>
                <div class="gdm-cms__field">
                  <label class="gdm-cms__label">Subtype</label>
                  <input v-model="form.subtype" type="text" class="gdm-cms__input" :style="inputBaseStyles" placeholder="Optional" />
                </div>
                <div class="gdm-cms__field gdm-cms__field--full">
                  <label class="gdm-cms__label">Title <span class="gdm-cms__required">*</span></label>
                  <input v-model="form.title" type="text" class="gdm-cms__input" :style="inputBaseStyles" placeholder="Article title" />
                </div>
                <div class="gdm-cms__field gdm-cms__field--full">
                  <label class="gdm-cms__label">Slug</label>
                  <input v-model="form.slug" type="text" class="gdm-cms__input" :style="inputBaseStyles" placeholder="auto-generated-from-title" />
                </div>
              </div>
            </div>
            <div class="gdm-cms__section">
              <p class="gdm-cms__section-label">Content</p>
              <div class="gdm-cms__field">
                <label class="gdm-cms__label">Short description</label>
                <textarea v-model="form.shortDescription" class="gdm-cms__textarea" :style="inputBaseStyles" rows="2" placeholder="Brief summary shown in previews" />
              </div>
              <div class="gdm-cms__field">
                <label class="gdm-cms__label">Content</label>
                <textarea v-model="form.bodyContent" class="gdm-cms__textarea" :style="inputBaseStyles" rows="6" placeholder="Full content (Markdown or plain text)" />
              </div>
              <div class="gdm-cms__field">
                <label class="gdm-cms__label">Image URL</label>
                <input v-model="form.imagelink" type="text" class="gdm-cms__input" :style="inputBaseStyles" placeholder="https://…" />
              </div>
            </div>
            <div class="gdm-cms__section">
              <p class="gdm-cms__section-label">Support</p>
              <div class="gdm-cms__grid-2">
                <div class="gdm-cms__field">
                  <label class="gdm-cms__label">Due date</label>
                  <input v-model="form.supportDue" type="date" class="gdm-cms__input" :style="inputBaseStyles" />
                </div>
                <div class="gdm-cms__field">
                  <label class="gdm-cms__label">Support status</label>
                  <select v-model="form.supportStatus" class="gdm-cms__select" :style="inputBaseStyles">
                    <option value="">None</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div class="gdm-cms__field gdm-cms__field--full">
                  <label class="gdm-cms__label">Ticket reference</label>
                  <input v-model="form.supportTicket" type="text" class="gdm-cms__input" :style="inputBaseStyles" placeholder="e.g. TKT-0042" />
                </div>
              </div>
            </div>
            <div v-if="projects.length > 0" class="gdm-cms__section">
              <p class="gdm-cms__section-label">Project</p>
              <div class="gdm-cms__field">
                <label class="gdm-cms__label">Linked project</label>
                <select v-model="form.projectIdRef" class="gdm-cms__select" :style="inputBaseStyles">
                  <option value="">None</option>
                  <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.title || p.id }}</option>
                </select>
              </div>
            </div>
            <div class="gdm-cms__form-actions">
              <button type="submit" class="gdm-cms__btn gdm-cms__btn--primary" :disabled="!form.title">{{ editingId ? 'Update Item' : submitLabel }}</button>
              <button v-if="editingId" type="button" class="gdm-cms__btn gdm-cms__btn--ghost" @click="cancelEdit">Cancel</button>
              <button v-else-if="props.content?.showResetButton !== false" type="button" class="gdm-cms__btn gdm-cms__btn--ghost" @click="handleReset">{{ resetLabel }}</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="cmsItems.length > 0" class="gdm-cms__list">
        <div class="gdm-cms__list-header">
          <span class="gdm-cms__list-count">{{ cmsItems.length }} item{{ cmsItems.length !== 1 ? 's' : '' }}</span>
        </div>
        <div v-for="item in cmsItems" :key="item.id" class="gdm-cms__item-card" :style="cardStyles">
          <div class="gdm-cms__item-left">
            <div class="gdm-cms__item-meta">
              <span v-if="item.type" class="gdm-cms__type-badge">{{ item.type }}</span>
              <span v-if="item.subtype" class="gdm-cms__subtype-badge">{{ item.subtype }}</span>
            </div>
            <div class="gdm-cms__item-title">{{ item.title || 'Untitled' }}</div>
            <div v-if="item.short_description" class="gdm-cms__item-desc">{{ item.short_description }}</div>
            <div class="gdm-cms__item-footer">
              <span v-if="item.support_status" class="gdm-cms__support-badge" :class="'gdm-cms__support-badge--' + item.support_status">{{ item.support_status }}</span>
              <span v-if="item.created_at" class="gdm-cms__item-date">{{ formatDate(item.created_at) }}</span>
            </div>
          </div>
          <div class="gdm-cms__item-actions">
            <button type="button" class="gdm-cms__action-btn gdm-cms__action-btn--edit" @click="startEdit(item)" title="Edit">✏️</button>
            <button type="button" class="gdm-cms__action-btn gdm-cms__action-btn--delete" @click="handleDelete(item)" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
      <div v-else-if="!formVisible" class="gdm-cms__empty">
        <div class="gdm-cms__empty-icon">📝</div>
        <p class="gdm-cms__empty-text">No CMS items yet</p>
        <p class="gdm-cms__empty-sub">Click <strong>+ New Item</strong> to add the first entry</p>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════
         CLIENT – COMPACT ACCORDION LIST
    ════════════════════════════════════════════════ -->
    <div v-else-if="isClientList" class="gdm-list">
      <template v-if="displayItems.length > 0">
        <div
          v-for="item in displayItems"
          :key="item.id"
          class="gdm-list-row"
          :class="{ 'gdm-list-row--expanded': expandedId === item.id, 'gdm-list-row--preview': item._preview }"
        >
          <!-- Row header -->
          <button type="button" class="gdm-list-row__head" @click="toggleExpand(item)">
            <span class="gdm-list-row__date">{{ formatDate(item.created_at) }}</span>
            <div class="gdm-list-row__badges">
              <span v-if="item.type" class="gdm-cms__type-badge">{{ item.type }}</span>
              <span v-if="item.subtype" class="gdm-cms__subtype-badge">{{ item.subtype }}</span>
              <span v-if="item.support_status" class="gdm-cms__support-badge" :class="'gdm-cms__support-badge--' + item.support_status">{{ item.support_status }}</span>
            </div>
            <span class="gdm-list-row__title">{{ item.title || 'Untitled' }}</span>
            <svg class="gdm-list-row__chevron" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Expanded body -->
          <div v-show="expandedId === item.id" class="gdm-list-row__body">
            <img v-if="item.imagelink" :src="item.imagelink" class="gdm-list-row__image" alt="" />
            <p v-if="item.short_description" class="gdm-list-row__desc">{{ item.short_description }}</p>
            <div v-if="item.content" class="gdm-list-row__content">{{ item.content }}</div>
            <div v-if="!item.short_description && !item.content" class="gdm-list-row__empty-content">No content available.</div>

            <!-- ── Embedded comment section ── -->
            <div v-if="showComments" class="gdm-ec">
              <button type="button" class="gdm-ec__toggle" @click.stop="toggleComments(item.id)">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="gdm-ec__toggle-icon">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 3V5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
                <span>{{ commentCountFor(item.id) === 0 ? 'No comments yet' : commentCountFor(item.id) + (commentCountFor(item.id) === 1 ? ' comment' : ' comments') }}</span>
                <svg class="gdm-ec__toggle-chevron" :class="{ 'gdm-ec__toggle-chevron--open': isCommentOpen(item.id) }" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div v-show="isCommentOpen(item.id)" class="gdm-ec__panel">
                <div
                  class="gdm-ec__scroll"
                  :ref="(el) => { if (el) commentsRefs[item.id] = el; }"
                >
                  <div v-if="getItemComments(item.id).length === 0" class="gdm-ec__empty">
                    <p>No comments yet — be the first to add one.</p>
                  </div>
                  <div
                    v-for="c in getItemComments(item.id)"
                    :key="c.id"
                    class="gdm-ec__msg"
                    :class="{ 'gdm-ec__msg--own': isOwnComment(c), 'gdm-ec__msg--preview': c._p }"
                  >
                    <div class="gdm-ec__avatar" :style="{ background: commentAvatarColor(c.user_id) }">{{ commentInitials(getCommentUserName(c)) }}</div>
                    <div class="gdm-ec__msg-body">
                      <div class="gdm-ec__msg-header">
                        <span class="gdm-ec__author">{{ getCommentUserName(c) }}</span>
                        <span v-if="isOwnComment(c)" class="gdm-ec__you">you</span>
                        <span class="gdm-ec__time">{{ formatRelDate(c.created_at) }}</span>
                        <button v-if="isAdmin && !c._p" type="button" class="gdm-ec__delete" @click="deleteComment(c)" title="Delete">✕</button>
                      </div>
                      <p class="gdm-ec__text">{{ c.message }}</p>
                    </div>
                  </div>
                </div>
                <div class="gdm-ec__compose">
                  <div class="gdm-ec__compose-avatar" :style="{ background: accent }">{{ currentUserInitial }}</div>
                  <textarea
                    v-model="newCommentFor[item.id]"
                    class="gdm-ec__input"
                    placeholder="Add a comment…"
                    rows="1"
                    @keydown.enter.exact.prevent="postComment(item)"
                  />
                  <button
                    type="button"
                    class="gdm-ec__post-btn"
                    :disabled="!newCommentFor[item.id] || !newCommentFor[item.id].trim()"
                    @click="postComment(item)"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="gdm-cms__empty">
        <div class="gdm-cms__empty-icon">📄</div>
        <p class="gdm-cms__empty-text">No articles yet</p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         CLIENT – SCROLL FEED (release-notes style)
    ════════════════════════════════════════════════ -->
    <div v-else class="gdm-feed">
      <template v-if="displayItems.length > 0">
        <article
          v-for="(item, idx) in displayItems"
          :key="item.id"
          class="gdm-feed-item"
          :class="{ 'gdm-feed-item--preview': item._preview }"
        >
          <div class="gdm-feed-item__meta">
            <span class="gdm-feed-item__date">{{ formatDate(item.created_at) }}</span>
            <div class="gdm-feed-item__tags">
              <span v-if="item.type" class="gdm-cms__type-badge">{{ item.type }}</span>
              <span v-if="item.subtype" class="gdm-cms__subtype-badge">{{ item.subtype }}</span>
              <span v-if="item.support_status" class="gdm-cms__support-badge" :class="'gdm-cms__support-badge--' + item.support_status">{{ item.support_status }}</span>
            </div>
          </div>
          <h2 class="gdm-feed-item__title">{{ item.title || 'Untitled' }}</h2>
          <img v-if="item.imagelink" :src="item.imagelink" class="gdm-feed-item__image" alt="" />
          <p v-if="item.short_description" class="gdm-feed-item__desc">{{ item.short_description }}</p>
          <div v-if="item.content" class="gdm-feed-item__body">{{ item.content }}</div>

          <!-- ── Embedded comment section ── -->
          <div v-if="showComments" class="gdm-ec gdm-ec--feed">
            <button type="button" class="gdm-ec__toggle" @click="toggleComments(item.id)">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="gdm-ec__toggle-icon">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 3V5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
              <span>{{ commentCountFor(item.id) === 0 ? 'No comments yet' : commentCountFor(item.id) + (commentCountFor(item.id) === 1 ? ' comment' : ' comments') }}</span>
              <svg class="gdm-ec__toggle-chevron" :class="{ 'gdm-ec__toggle-chevron--open': isCommentOpen(item.id) }" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-show="isCommentOpen(item.id)" class="gdm-ec__panel">
              <div
                class="gdm-ec__scroll"
                :ref="(el) => { if (el) commentsRefs[item.id] = el; }"
              >
                <div v-if="getItemComments(item.id).length === 0" class="gdm-ec__empty">
                  <p>No comments yet — be the first to add one.</p>
                </div>
                <div
                  v-for="c in getItemComments(item.id)"
                  :key="c.id"
                  class="gdm-ec__msg"
                  :class="{ 'gdm-ec__msg--own': isOwnComment(c), 'gdm-ec__msg--preview': c._p }"
                >
                  <div class="gdm-ec__avatar" :style="{ background: commentAvatarColor(c.user_id) }">{{ commentInitials(getCommentUserName(c)) }}</div>
                  <div class="gdm-ec__msg-body">
                    <div class="gdm-ec__msg-header">
                      <span class="gdm-ec__author">{{ getCommentUserName(c) }}</span>
                      <span v-if="isOwnComment(c)" class="gdm-ec__you">you</span>
                      <span class="gdm-ec__time">{{ formatRelDate(c.created_at) }}</span>
                      <button v-if="isAdmin && !c._p" type="button" class="gdm-ec__delete" @click="deleteComment(c)" title="Delete">✕</button>
                    </div>
                    <p class="gdm-ec__text">{{ c.message }}</p>
                  </div>
                </div>
              </div>
              <div class="gdm-ec__compose">
                <div class="gdm-ec__compose-avatar" :style="{ background: accent }">{{ currentUserInitial }}</div>
                <textarea
                  v-model="newCommentFor[item.id]"
                  class="gdm-ec__input"
                  placeholder="Add a comment…"
                  rows="1"
                  @keydown.enter.exact.prevent="postComment(item)"
                />
                <button
                  type="button"
                  class="gdm-ec__post-btn"
                  :disabled="!newCommentFor[item.id] || !newCommentFor[item.id].trim()"
                  @click="postComment(item)"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="idx < displayItems.length - 1" class="gdm-feed-item__divider"></div>
        </article>
      </template>
      <div v-else class="gdm-cms__empty">
        <div class="gdm-cms__empty-icon">📄</div>
        <p class="gdm-cms__empty-text">No articles yet</p>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, reactive, nextTick } from 'vue';

/* ─── Preview CMS items ─── */
const PREVIEW_ITEMS = [
  { id: 'p1', _preview: true, type: 'changelog', subtype: '', title: 'Platform update v2.4 — New dashboard', short_description: 'We\'ve rolled out a completely redesigned analytics dashboard with improved charts and real-time data.', content: 'The new layout brings key metrics front and center, with live updates and customizable widget placement. Widgets can be resized and repositioned via drag-and-drop. Saved layouts persist across sessions and can be shared with teammates.', imagelink: '', support_status: '', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'p2', _preview: true, type: 'documentation', subtype: 'api', title: 'REST API Reference — Authentication', short_description: 'Complete guide to authenticating with the API using Bearer tokens and managing refresh cycles.', content: 'All endpoints require an Authorization header with a valid Bearer token. Tokens are issued via POST /auth/token and expire after 24 hours. Use POST /auth/refresh to renew without re-authenticating.', imagelink: '', support_status: 'open', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 'p3', _preview: true, type: 'article', subtype: '', title: 'Getting started with your account', short_description: 'Everything you need to know to get up and running in under five minutes.', content: 'Create your account, set up your first project, and invite your team. Our guided setup wizard walks you through each step. Most teams are fully operational within the first hour.', imagelink: '', support_status: '', created_at: new Date(Date.now() - 86400000 * 14).toISOString() },
];

/* ─── Preview comments ─── */
const COMMS_PREVIEW = [
  { id: 'cp1', _p: true, user_id: 'u1', message: 'Thanks for the update — the new layout looks great! Much cleaner than before.', created_at: new Date(Date.now() - 3600000 * 5).toISOString(), cms_id: 'p1' },
  { id: 'cp2', _p: true, user_id: 'u2', message: 'Quick question: will the API documentation be updated to reflect these changes too?', created_at: new Date(Date.now() - 3600000 * 3).toISOString(), cms_id: 'p1' },
  { id: 'cp3', _p: true, user_id: 'u1', message: 'Yes, being updated now — should be live by end of week.', created_at: new Date(Date.now() - 3600000 * 1).toISOString(), cms_id: 'p1' },
];

/* ─── Comment avatar colours ─── */
const AVATAR_COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#64748b'];
const colorForId = (id) => {
  if (!id) return '#64748b';
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
};

/* ─── Preview user names ─── */
const PREVIEW_USERS = { u1: 'Alice Lee', u2: 'John D.' };

export default {
  name: 'GdmCmsManager',
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {

    /* ─── Data from bindings ─── */
    const getList = (key) => {
      const data = props.content?.[key];
      if (!data) return [];
      const arr = typeof wwLib !== 'undefined' && wwLib?.wwUtils?.getDataFromCollection
        ? wwLib.wwUtils.getDataFromCollection(data)
        : data;
      return Array.isArray(arr) ? arr : [];
    };

    const cmsItems  = computed(() => getList('cmsData'));
    const clients   = computed(() => getList('clientsData'));
    const projects  = computed(() => getList('projectsData'));

    /* ─── View mode ─── */
    const isAdmin      = computed(() => props.content?.viewMode === 'admin' || !props.content?.viewMode);
    const isClientList = computed(() => props.content?.viewMode === 'client');

    /* ─── Form ─── */
    const formVisible = ref(props.content?.showForm !== false);
    const editingId   = ref(null);

    const toggleForm = () => {
      if (editingId.value) cancelEdit();
      formVisible.value = !formVisible.value;
    };

    const blankForm = () => ({
      clientId: props.content?.clientId ?? '', type: props.content?.type ?? '',
      subtype: props.content?.subtype ?? '', title: props.content?.title ?? '',
      slug: props.content?.slug ?? '', shortDescription: props.content?.shortDescription ?? '',
      bodyContent: props.content?.content ?? '', imagelink: props.content?.imagelink ?? '',
      supportDue: props.content?.supportDue ?? '', supportStatus: props.content?.supportStatus ?? '',
      supportTicket: props.content?.supportTicket ?? '', projectIdRef: props.content?.projectIdRef ?? '',
    });

    const form = ref(blankForm());
    const handleReset = () => { form.value = blankForm(); };

    const startEdit = (item) => {
      editingId.value = item.id;
      form.value = {
        clientId: item.client_id ?? '', type: item.type ?? '', subtype: item.subtype ?? '',
        title: item.title ?? '', slug: item.slug ?? '', shortDescription: item.short_description ?? '',
        bodyContent: item.content ?? '', imagelink: item.imagelink ?? '', supportDue: item.support_due ?? '',
        supportStatus: item.support_status ?? '', supportTicket: item.support_ticket ?? '',
        projectIdRef: item.projectidref ?? '',
      };
      formVisible.value = true;
    };

    const cancelEdit = () => { editingId.value = null; form.value = blankForm(); };

    const handleSubmit = () => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing) return;
      /* wwEditor:end */
      const payload = {
        title: form.value.title || null, type: form.value.type || null,
        subtype: form.value.subtype || null, slug: form.value.slug || null,
        short_description: form.value.shortDescription || null, content: form.value.bodyContent || null,
        client_id: form.value.clientId || null, imagelink: form.value.imagelink || null,
        support_due: form.value.supportDue || null, support_status: form.value.supportStatus || null,
        support_ticket: form.value.supportTicket || null, projectidref: form.value.projectIdRef || null,
      };
      if (editingId.value) {
        emit('trigger-event', { name: 'onUpdate', event: { value: { id: editingId.value, ...payload } } });
        cancelEdit();
      } else {
        emit('trigger-event', { name: 'onSubmit', event: { value: payload } });
        form.value = blankForm();
        if (props.content?.showForm === false) formVisible.value = false;
      }
    };

    const handleDelete = (item) => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing) return;
      /* wwEditor:end */
      emit('trigger-event', { name: 'onDeleteItem', event: { value: { id: item.id, title: item.title } } });
    };

    /* ─── Accordion expand ─── */
    const expandedId = ref(null);

    const isEditionMode = () => {
      /* wwEditor:start */
      return props.wwEditorState?.editMode === wwLib?.wwEditorHelper?.EDIT_MODES?.EDITION;
      /* wwEditor:end */
      return false; // eslint-disable-line no-unreachable
    };

    const toggleExpand = (item) => {
      /* wwEditor:start */
      if (isEditionMode()) return;
      /* wwEditor:end */
      expandedId.value = expandedId.value === item.id ? null : item.id;
      if (item._preview) return;
      emit('trigger-event', { name: 'onItemClick', event: { value: { item } } });
    };

    /* ─── Display items ─── */
    const displayItems = computed(() => {
      const items = cmsItems.value;
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing && items.length === 0) return PREVIEW_ITEMS;
      /* wwEditor:end */
      return items;
    });

    /* ═══════════════════════════════════
       EMBEDDED COMMENTS
    ═══════════════════════════════════ */
    const showComments = computed(() => props.content?.showComments !== false);

    /* ─── All comms data ─── */
    const allComments = computed(() => {
      const data = props.content?.commsData;
      let arr = [];
      if (data) {
        arr = typeof wwLib !== 'undefined' && wwLib?.wwUtils?.getDataFromCollection
          ? wwLib.wwUtils.getDataFromCollection(data)
          : data;
        if (!Array.isArray(arr)) arr = [];
      }
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing && arr.length === 0) return COMMS_PREVIEW;
      /* wwEditor:end */
      return arr;
    });

    /* ─── Users map ─── */
    const usersMap = computed(() => {
      const data = props.content?.usersData;
      if (!data) return {};
      const arr = typeof wwLib !== 'undefined' && wwLib?.wwUtils?.getDataFromCollection
        ? wwLib.wwUtils.getDataFromCollection(data)
        : data;
      if (!Array.isArray(arr)) return {};
      const map = {};
      arr.forEach(u => { const id = u.userid ?? u.id; if (id) map[id] = u.contact_name ?? u.name ?? 'User'; });
      return map;
    });

    /* ─── Per-item comment helpers ─── */
    const getItemComments = (itemId) => {
      return allComments.value
        .filter(c => (c.cms_id ?? c['cms_id']) === itemId)
        .sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    };

    const commentCountFor = (itemId) => getItemComments(itemId).length;

    /* ─── Open state (reactive Set) ─── */
    const openComments = reactive(new Set());
    const commentsRefs = {};

    const isCommentOpen = (itemId) => openComments.has(itemId);

    const scrollToBottom = (itemId) => {
      const el = commentsRefs[itemId];
      if (el) el.scrollTop = el.scrollHeight;
    };

    const toggleComments = (itemId) => {
      /* wwEditor:start */
      if (isEditionMode()) return;
      /* wwEditor:end */
      if (openComments.has(itemId)) {
        openComments.delete(itemId);
      } else {
        openComments.add(itemId);
        nextTick(() => scrollToBottom(itemId));
      }
    };

    /* ─── Comment user helpers ─── */
    const getCommentUserName = (comment) => {
      const id = comment.user_id;
      if (!id) return 'User';
      /* wwEditor:start */
      if (comment._p && PREVIEW_USERS[id]) return PREVIEW_USERS[id];
      /* wwEditor:end */
      return usersMap.value[id] || 'User';
    };

    const commentInitials = (name) => {
      if (!name || name === 'User') return '?';
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return name.slice(0, 2).toUpperCase();
    };

    const commentAvatarColor = (userId) => colorForId(userId);

    const isOwnComment = (comment) => {
      const uid = props.content?.currentUserId;
      return !!(uid && comment.user_id === uid);
    };

    /* ─── Current user avatar ─── */
    const currentUserInitial = computed(() => {
      const uid = props.content?.currentUserId;
      if (!uid) return '?';
      const name = usersMap.value[uid];
      return name ? commentInitials(name) : uid.slice(0, 1).toUpperCase();
    });

    /* ─── Relative date ─── */
    const formatRelDate = (d) => {
      if (!d) return '';
      try {
        const date = new Date(d);
        if (isNaN(date.getTime())) return String(d);
        const diff = (Date.now() - date.getTime()) / 1000;
        if (diff < 60)    return 'just now';
        if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      } catch { return String(d); }
    };

    /* ─── New comment per item ─── */
    const newCommentFor = reactive({});

    const postComment = (item) => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing) return;
      /* wwEditor:end */
      const msg = (newCommentFor[item.id] || '').trim();
      if (!msg) return;
      emit('trigger-event', {
        name: 'onAddComment',
        event: { value: { message: msg, cms_id: item.id, user_id: props.content?.currentUserId || null } },
      });
      newCommentFor[item.id] = '';
      nextTick(() => scrollToBottom(item.id));
    };

    const deleteComment = (comment) => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing) return;
      /* wwEditor:end */
      if (comment._p) return;
      emit('trigger-event', {
        name: 'onDeleteComment',
        event: { value: { id: comment.id, message: comment.message } },
      });
    };

    /* ─── Labels & formatting ─── */
    const getText = (val, fallback) => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwLang?.getText) return wwLib.wwLang.getText(val) || fallback;
      return val || fallback;
    };
    const submitLabel = computed(() => getText(props.content?.submitButtonText, 'Add Item'));
    const resetLabel  = computed(() => getText(props.content?.resetButtonText, 'Reset'));

    const formatDate = (d) => {
      if (!d) return '';
      try {
        const date = new Date(d);
        return isNaN(date.getTime()) ? String(d) : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch { return String(d); }
    };

    /* ─── Styles ─── */
    const accent = computed(() => props.content?.accentColor || '#0d9488');
    const cssVars = computed(() => ({
      fontFamily: props.content?.fontFamily || 'DM Sans, system-ui, sans-serif',
      fontSize: props.content?.fontSize || '15px',
      '--gdm-accent': accent.value,
      '--gdm-accent-text': props.content?.accentTextColor || '#ffffff',
      '--gdm-danger': props.content?.dangerColor || '#ef4444',
      '--gdm-label': props.content?.labelColor || '#475569',
      '--gdm-text': props.content?.textColor || '#1e293b',
      '--gdm-input-bg': props.content?.inputBackgroundColor || '#f8fafc',
      '--gdm-input-border': props.content?.inputBorderColor || '#e2e8f0',
      '--gdm-input-text': props.content?.inputTextColor || '#1e293b',
      '--gdm-focus': props.content?.inputFocusColor || '#0d9488',
      '--gdm-ec-max-h': props.content?.commentsMaxHeight || '280px',
      minHeight: '120px',
    }));
    const cardStyles = computed(() => ({
      backgroundColor: props.content?.cardBackgroundColor || '#ffffff',
      borderRadius: props.content?.cardBorderRadius || '12px',
      padding: props.content?.cardPadding || '20px',
    }));
    const inputBaseStyles = computed(() => ({
      backgroundColor: 'var(--gdm-input-bg)',
      borderColor: 'var(--gdm-input-border)',
      color: 'var(--gdm-input-text)',
    }));

    return {
      props, isAdmin, isClientList,
      formVisible, form, editingId,
      cmsItems, clients, projects, displayItems,
      submitLabel, resetLabel,
      toggleForm, toggleExpand, startEdit, cancelEdit, handleReset, handleSubmit, handleDelete,
      formatDate,
      /* comments */
      showComments, allComments, accent,
      openComments, commentsRefs, newCommentFor,
      isCommentOpen, toggleComments,
      getItemComments, commentCountFor,
      getCommentUserName, commentInitials, commentAvatarColor, isOwnComment,
      currentUserInitial, formatRelDate, postComment, deleteComment,
      cssVars, cardStyles, inputBaseStyles,
    };
  },
};
</script>

<style lang="scss" scoped>
.gdm-cms {
  width: 100%;
  box-sizing: border-box;
  color: var(--gdm-text);
}

/* ─────────────── SHARED BADGES ─────────────── */
.gdm-cms__type-badge {
  font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem; border-radius: 4px; white-space: nowrap;
  background: color-mix(in srgb, var(--gdm-accent) 12%, transparent);
  color: var(--gdm-accent);
}
.gdm-cms__subtype-badge {
  font-size: 0.6875rem; padding: 0.2rem 0.5rem; border-radius: 4px;
  background: #f1f5f9; color: #64748b; font-weight: 500; white-space: nowrap;
}
.gdm-cms__support-badge {
  font-size: 0.6875rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; white-space: nowrap;
  &--open { background: #fef3c7; color: #d97706; }
  &--in_progress { background: #eff6ff; color: #2563eb; }
  &--closed { background: #f0fdf4; color: #16a34a; }
}
.gdm-cms__item-date { font-size: 0.75rem; color: #94a3b8; }

/* ─────────────── ADMIN ─────────────── */
.gdm-cms__admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; gap: 1rem; }
.gdm-cms__admin-header-left { display: flex; align-items: center; gap: 0.625rem; }
.gdm-cms__admin-badge {
  font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--gdm-accent); background: color-mix(in srgb, var(--gdm-accent) 12%, transparent);
  padding: 0.2rem 0.5rem; border-radius: 4px;
}
.gdm-cms__admin-title { margin: 0; font-size: 1.125rem; font-weight: 700; }
.gdm-cms__form-wrap { margin-bottom: 1.5rem; }
.gdm-cms__form-card { border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.gdm-cms__form-card-header { display: flex; align-items: center; gap: 0.625rem; margin-bottom: 1.25rem; }
.gdm-cms__form-title { margin: 0; font-size: 1rem; font-weight: 600; }
.gdm-cms__editing-badge { font-size: 0.6875rem; color: #f59e0b; background: #fef3c7; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; }
.gdm-cms__form { display: flex; flex-direction: column; gap: 1.25rem; }
.gdm-cms__section { display: flex; flex-direction: column; gap: 0.75rem; }
.gdm-cms__section-label { margin: 0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gdm-label); padding-bottom: 0.375rem; border-bottom: 1px solid #f1f5f9; }
.gdm-cms__grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
.gdm-cms__field { display: flex; flex-direction: column; gap: 0.375rem; &--full { grid-column: 1 / -1; } }
.gdm-cms__label { font-size: 0.8125rem; font-weight: 500; color: var(--gdm-label); }
.gdm-cms__required { color: #ef4444; }
.gdm-cms__input, .gdm-cms__select, .gdm-cms__textarea {
  width: 100%; box-sizing: border-box; padding: 0.5rem 0.75rem; border: 1.5px solid var(--gdm-input-border);
  border-radius: 7px; font-size: inherit; font-family: inherit; background-color: var(--gdm-input-bg);
  color: var(--gdm-input-text); transition: border-color 0.15s, box-shadow 0.15s; outline: none;
  &:focus { border-color: var(--gdm-focus); box-shadow: 0 0 0 3px color-mix(in srgb, var(--gdm-focus) 20%, transparent); }
  &::placeholder { color: #94a3b8; }
}
.gdm-cms__textarea { resize: vertical; min-height: 64px; }
.gdm-cms__form-actions { display: flex; gap: 0.625rem; padding-top: 0.5rem; }
.gdm-cms__btn {
  padding: 0.5rem 1.125rem; border-radius: 7px; font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none;
  transition: opacity 0.15s, transform 0.1s;
  &:hover:not(:disabled) { opacity: 0.88; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &--primary { background: var(--gdm-accent); color: var(--gdm-accent-text); }
  &--ghost { background: transparent; color: #64748b; border: 1.5px solid #cbd5e1; }
}
.gdm-cms__list { display: flex; flex-direction: column; gap: 0.625rem; }
.gdm-cms__list-header { display: flex; align-items: center; margin-bottom: 0.25rem; }
.gdm-cms__list-count { font-size: 0.8125rem; color: #94a3b8; font-weight: 500; }
.gdm-cms__item-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: box-shadow 0.15s; &:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.08); } }
.gdm-cms__item-left { flex: 1; min-width: 0; }
.gdm-cms__item-meta { display: flex; gap: 0.375rem; margin-bottom: 0.375rem; flex-wrap: wrap; }
.gdm-cms__item-title { font-weight: 600; font-size: 0.9375rem; margin-bottom: 0.25rem; }
.gdm-cms__item-desc { font-size: 0.8125rem; color: #64748b; line-height: 1.45; margin-bottom: 0.5rem; }
.gdm-cms__item-footer { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; }
.gdm-cms__item-actions { display: flex; gap: 0.375rem; flex-shrink: 0; }
.gdm-cms__action-btn { width: 32px; height: 32px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; transition: background 0.15s, transform 0.1s; background: transparent; &:active { transform: scale(0.92); } &--edit:hover { background: #eff6ff; } &--delete:hover { background: #fef2f2; } }

/* ─────────────── ACCORDION LIST ─────────────── */
.gdm-list { display: flex; flex-direction: column; width: 100%; }
.gdm-list-row {
  border-bottom: 1px solid #e2e8f0;
  &:first-child { border-top: 1px solid #e2e8f0; }
  &--preview { opacity: 0.7; }
  &--expanded .gdm-list-row__chevron { transform: rotate(180deg); }
}
.gdm-list-row__head { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.75rem 0.25rem; background: none; border: none; cursor: pointer; text-align: left; color: inherit; font-family: inherit; font-size: inherit; transition: background 0.12s; pointer-events: all; &:hover { background: #f8fafc; } }
.gdm-list-row__date { font-size: 0.75rem; color: #94a3b8; white-space: nowrap; min-width: 6rem; flex-shrink: 0; }
.gdm-list-row__badges { display: flex; gap: 0.3rem; flex-shrink: 0; flex-wrap: nowrap; }
.gdm-list-row__title { flex: 1; font-size: 0.9rem; font-weight: 500; color: var(--gdm-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.gdm-list-row__chevron { width: 16px; height: 16px; flex-shrink: 0; color: #94a3b8; transition: transform 0.2s ease; }
.gdm-list-row__body { padding: 0 0.25rem 1.25rem; border-top: 1px dashed #e2e8f0; }
.gdm-list-row__image { width: 100%; max-height: 240px; object-fit: cover; border-radius: 8px; display: block; margin: 1rem 0; }
.gdm-list-row__desc { font-size: 0.9rem; color: #334155; line-height: 1.6; margin: 1rem 0 0.5rem; font-weight: 500; }
.gdm-list-row__content { font-size: 0.875rem; color: #475569; line-height: 1.7; white-space: pre-wrap; margin-top: 0.5rem; }
.gdm-list-row__empty-content { font-size: 0.8125rem; color: #94a3b8; font-style: italic; margin-top: 1rem; }

/* ─────────────── SCROLL FEED ─────────────── */
.gdm-feed { display: flex; flex-direction: column; width: 100%; }
.gdm-feed-item { padding: 1.75rem 0; &--preview { opacity: 0.75; } }
.gdm-feed-item__meta { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; margin-bottom: 0.625rem; }
.gdm-feed-item__date { font-size: 0.8rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.02em; }
.gdm-feed-item__tags { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.gdm-feed-item__title { margin: 0 0 0.875rem; font-size: 1.125rem; font-weight: 700; line-height: 1.3; color: var(--gdm-text); }
.gdm-feed-item__image { width: 100%; max-height: 280px; object-fit: cover; border-radius: 8px; display: block; margin-bottom: 1rem; }
.gdm-feed-item__desc { margin: 0 0 0.625rem; font-size: 0.9375rem; color: #334155; line-height: 1.6; font-weight: 500; }
.gdm-feed-item__body { font-size: 0.875rem; color: #475569; line-height: 1.75; white-space: pre-wrap; margin-top: 0.25rem; }
.gdm-feed-item__divider { height: 1px; background: #e2e8f0; margin-top: 1.75rem; }

/* ═══════════════════════════════════════════
   EMBEDDED COMMENTS  (.gdm-ec)
═══════════════════════════════════════════ */
.gdm-ec {
  margin-top: 1.25rem;

  &--feed {
    /* in scroll feed, give it a little breathing room */
    margin-top: 1.5rem;
  }
}

/* Toggle button */
.gdm-ec__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #64748b;
  padding: 0.35rem 0;
  transition: color 0.15s;
  user-select: none;
  pointer-events: all;

  &:hover { color: var(--gdm-accent); }
}
.gdm-ec__toggle-icon { width: 15px; height: 15px; flex-shrink: 0; opacity: 0.7; }
.gdm-ec__toggle-chevron { width: 13px; height: 13px; flex-shrink: 0; transition: transform 0.2s ease; &--open { transform: rotate(180deg); } }

/* Panel */
.gdm-ec__panel {
  margin-top: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Scroll area — shows messages, capped height, defaults to bottom */
.gdm-ec__scroll {
  overflow-y: auto;
  max-height: var(--gdm-ec-max-h, 280px);
  padding: 1rem 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  scroll-behavior: smooth;

  /* Nice thin scrollbar */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
}

/* Individual message */
.gdm-ec__msg {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  animation: gdm-ec-fade-in 0.18s ease;

  &--preview { opacity: 0.85; }
  &--own .gdm-ec__author { color: var(--gdm-accent); }
}

@keyframes gdm-ec-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.gdm-ec__avatar {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  margin-top: 1px;
}

.gdm-ec__msg-body { flex: 1; min-width: 0; }

.gdm-ec__msg-header {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  margin-bottom: 0.2rem;
  flex-wrap: wrap;
}

.gdm-ec__author { font-size: 0.8125rem; font-weight: 700; color: #334155; }
.gdm-ec__you { font-size: 0.625rem; font-weight: 600; color: var(--gdm-accent); background: color-mix(in srgb, var(--gdm-accent) 12%, transparent); padding: 0.1rem 0.3rem; border-radius: 3px; }
.gdm-ec__time { font-size: 0.6875rem; color: #94a3b8; margin-left: auto; }
.gdm-ec__delete {
  opacity: 0;
  border: none; background: none; cursor: pointer; font-size: 0.625rem; color: #94a3b8; padding: 2px 4px; border-radius: 3px;
  transition: color 0.12s, background 0.12s, opacity 0.12s;
  .gdm-ec__msg:hover & { opacity: 1; }
  &:hover { color: #ef4444; background: #fef2f2; opacity: 1 !important; }
}

.gdm-ec__text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: #475569;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Empty state */
.gdm-ec__empty {
  padding: 1.5rem 0.5rem;
  text-align: center;
  p { margin: 0; font-size: 0.8125rem; color: #94a3b8; font-style: italic; }
}

/* Compose area */
.gdm-ec__compose {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e2e8f0;
  background: #fff;
  flex-shrink: 0;
}

.gdm-ec__compose-avatar {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
}

.gdm-ec__input {
  flex: 1;
  min-width: 0;
  resize: none;
  overflow-y: auto;
  max-height: 80px;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  font-size: 0.875rem;
  font-family: inherit;
  background: #f8fafc;
  color: var(--gdm-text);
  outline: none;
  line-height: 1.45;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: var(--gdm-accent);
    background: #fff;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--gdm-accent) 14%, transparent);
  }
  &::placeholder { color: #94a3b8; }
}

.gdm-ec__post-btn {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: var(--gdm-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  padding: 0;

  svg { width: 15px; height: 15px; }

  &:hover:not(:disabled) { opacity: 0.88; }
  &:active:not(:disabled) { transform: scale(0.93); }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
}

/* Responsive: hide compose avatar on narrow screens */
@media (max-width: 380px) {
  .gdm-ec__compose-avatar { display: none; }
  .gdm-list-row__date { display: none; }
}

/* ─────────────── EMPTY STATE ─────────────── */
.gdm-cms__empty { padding: 2.5rem 1rem; text-align: center; background: #f8fafc; border-radius: 10px; border: 1.5px dashed #e2e8f0; }
.gdm-cms__empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.gdm-cms__empty-text { margin: 0 0 0.25rem; font-weight: 600; color: #475569; }
.gdm-cms__empty-sub { margin: 0; font-size: 0.8125rem; color: #94a3b8; }
</style>
