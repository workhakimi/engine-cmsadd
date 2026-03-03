<template>
  <div class="gdm-cms" :style="cssVars">

    <!-- ═══════════════════════════════════════════════
         ADMIN MODE
    ════════════════════════════════════════════════ -->
    <div v-if="isAdmin">

      <!-- Admin header -->
      <div class="gdm-cms__admin-header">
        <div class="gdm-cms__admin-header-left">
          <span class="gdm-cms__admin-badge">Admin</span>
          <h2 class="gdm-cms__admin-title">CMS Manager</h2>
        </div>
        <button
          type="button"
          class="gdm-cms__btn gdm-cms__btn--primary"
          @click="toggleForm"
        >
          {{ formVisible ? '✕ Close' : '+ New Item' }}
        </button>
      </div>

      <!-- Add / Edit Form -->
      <div v-if="formVisible" class="gdm-cms__form-wrap">
        <div class="gdm-cms__form-card" :style="cardStyles">
          <div class="gdm-cms__form-card-header">
            <h3 class="gdm-cms__form-title">{{ editingId ? 'Edit Item' : 'New CMS Item' }}</h3>
            <span v-if="editingId" class="gdm-cms__editing-badge">editing</span>
          </div>
          <form class="gdm-cms__form" @submit.prevent="handleSubmit">

            <!-- Basic Info -->
            <div class="gdm-cms__section">
              <p class="gdm-cms__section-label">Basic Info</p>
              <div class="gdm-cms__grid-2">
                <div v-if="clients.length > 0" class="gdm-cms__field">
                  <label class="gdm-cms__label">Client</label>
                  <select v-model="form.clientId" class="gdm-cms__select" :style="inputBaseStyles">
                    <option value="">Select client</option>
                    <option v-for="c in clients" :key="c.id" :value="c.id">
                      {{ c.company_name || c.contact_name || c.id }}
                    </option>
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

            <!-- Content -->
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

            <!-- Support -->
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

            <!-- Project link -->
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

            <!-- Actions -->
            <div class="gdm-cms__form-actions">
              <button type="submit" class="gdm-cms__btn gdm-cms__btn--primary" :disabled="!form.title">
                {{ editingId ? 'Update Item' : submitLabel }}
              </button>
              <button v-if="editingId" type="button" class="gdm-cms__btn gdm-cms__btn--ghost" @click="cancelEdit">
                Cancel
              </button>
              <button v-else-if="props.content?.showResetButton !== false" type="button" class="gdm-cms__btn gdm-cms__btn--ghost" @click="handleReset">
                {{ resetLabel }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Existing items list -->
      <div v-if="cmsItems.length > 0" class="gdm-cms__list">
        <div class="gdm-cms__list-header">
          <span class="gdm-cms__list-count">{{ cmsItems.length }} item{{ cmsItems.length !== 1 ? 's' : '' }}</span>
        </div>
        <div
          v-for="item in cmsItems"
          :key="item.id"
          class="gdm-cms__item-card"
          :style="cardStyles"
        >
          <div class="gdm-cms__item-left">
            <div class="gdm-cms__item-meta">
              <span v-if="item.type" class="gdm-cms__type-badge">{{ item.type }}</span>
              <span v-if="item.subtype" class="gdm-cms__subtype-badge">{{ item.subtype }}</span>
            </div>
            <div class="gdm-cms__item-title">{{ item.title || 'Untitled' }}</div>
            <div v-if="item.short_description" class="gdm-cms__item-desc">{{ item.short_description }}</div>
            <div class="gdm-cms__item-footer">
              <span v-if="item.support_status" class="gdm-cms__support-badge" :class="'gdm-cms__support-badge--' + item.support_status">
                {{ item.support_status }}
              </span>
              <span v-if="item.created_at" class="gdm-cms__item-date">{{ formatDate(item.created_at) }}</span>
            </div>
          </div>
          <div class="gdm-cms__item-actions">
            <button type="button" class="gdm-cms__action-btn gdm-cms__action-btn--edit" @click="startEdit(item)" title="Edit">
              ✏️
            </button>
            <button type="button" class="gdm-cms__action-btn gdm-cms__action-btn--delete" @click="handleDelete(item)" title="Delete">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Admin empty state -->
      <div v-else-if="!formVisible" class="gdm-cms__empty">
        <div class="gdm-cms__empty-icon">📝</div>
        <p class="gdm-cms__empty-text">No CMS items yet</p>
        <p class="gdm-cms__empty-sub">Click <strong>+ New Item</strong> to add the first entry</p>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════
         CLIENT MODE
    ════════════════════════════════════════════════ -->
    <div v-else class="gdm-cms__client">
      <div
        v-for="item in displayItems"
        :key="item.id"
        class="gdm-cms__client-card"
        :style="cardStyles"
        :class="{ 'gdm-cms__client-card--preview': item._preview }"
        @click="handleItemClick(item)"
      >
        <img v-if="item.imagelink" :src="item.imagelink" class="gdm-cms__client-img" alt="" />
        <div class="gdm-cms__client-body">
          <div class="gdm-cms__client-meta">
            <span v-if="item.type" class="gdm-cms__type-badge">{{ item.type }}</span>
            <span v-if="item.support_status" class="gdm-cms__support-badge" :class="'gdm-cms__support-badge--' + item.support_status">
              {{ item.support_status }}
            </span>
          </div>
          <h3 class="gdm-cms__client-title">{{ item.title || 'Untitled' }}</h3>
          <p v-if="item.short_description" class="gdm-cms__client-desc">{{ item.short_description }}</p>
          <div class="gdm-cms__client-footer">
            <span v-if="item.created_at" class="gdm-cms__item-date">{{ formatDate(item.created_at) }}</span>
            <span class="gdm-cms__client-read">Read →</span>
          </div>
        </div>
      </div>
      <div v-if="displayItems.length === 0" class="gdm-cms__empty">
        <div class="gdm-cms__empty-icon">📄</div>
        <p class="gdm-cms__empty-text">No articles yet</p>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue';

const PREVIEW_ITEMS = [
  { id: 'p1', _preview: true, type: 'changelog', subtype: '', title: 'Platform update v2.4 — New dashboard', short_description: 'We\'ve rolled out a completely redesigned analytics dashboard with improved charts and real-time data.', imagelink: '', support_status: '', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'p2', _preview: true, type: 'documentation', subtype: 'api', title: 'REST API Reference — Authentication', short_description: 'Complete guide to authenticating with the API using Bearer tokens and managing refresh cycles.', imagelink: '', support_status: 'open', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 'p3', _preview: true, type: 'article', subtype: '', title: 'Getting started with your account', short_description: 'Everything you need to know to get up and running in under five minutes.', imagelink: '', support_status: '', created_at: new Date(Date.now() - 86400000 * 14).toISOString() },
];

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

    const cmsItems = computed(() => getList('cmsData'));
    const clients  = computed(() => getList('clientsData'));
    const projects = computed(() => getList('projectsData'));

    /* ─── View mode ─── */
    const isAdmin = computed(() => props.content?.viewMode !== 'client');

    /* ─── Form visibility ─── */
    const formVisible = ref(props.content?.showForm !== false);

    const toggleForm = () => {
      if (editingId.value) cancelEdit();
      formVisible.value = !formVisible.value;
    };

    /* ─── Form state ─── */
    const editingId = ref(null);

    const blankForm = () => ({
      clientId: props.content?.clientId ?? '',
      type: props.content?.type ?? '',
      subtype: props.content?.subtype ?? '',
      title: props.content?.title ?? '',
      slug: props.content?.slug ?? '',
      shortDescription: props.content?.shortDescription ?? '',
      bodyContent: props.content?.content ?? '',
      imagelink: props.content?.imagelink ?? '',
      supportDue: props.content?.supportDue ?? '',
      supportStatus: props.content?.supportStatus ?? '',
      supportTicket: props.content?.supportTicket ?? '',
      projectIdRef: props.content?.projectIdRef ?? '',
    });

    const form = ref(blankForm());

    const handleReset = () => { form.value = blankForm(); };

    const startEdit = (item) => {
      editingId.value = item.id;
      form.value = {
        clientId: item.client_id ?? '',
        type: item.type ?? '',
        subtype: item.subtype ?? '',
        title: item.title ?? '',
        slug: item.slug ?? '',
        shortDescription: item.short_description ?? '',
        bodyContent: item.content ?? '',
        imagelink: item.imagelink ?? '',
        supportDue: item.support_due ?? '',
        supportStatus: item.support_status ?? '',
        supportTicket: item.support_ticket ?? '',
        projectIdRef: item.projectidref ?? '',
      };
      formVisible.value = true;
    };

    const cancelEdit = () => {
      editingId.value = null;
      form.value = blankForm();
    };

    /* ─── Submit / Update / Delete ─── */
    const handleSubmit = () => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing) return;
      /* wwEditor:end */

      const payload = {
        title: form.value.title || null,
        type: form.value.type || null,
        subtype: form.value.subtype || null,
        slug: form.value.slug || null,
        short_description: form.value.shortDescription || null,
        content: form.value.bodyContent || null,
        client_id: form.value.clientId || null,
        imagelink: form.value.imagelink || null,
        support_due: form.value.supportDue || null,
        support_status: form.value.supportStatus || null,
        support_ticket: form.value.supportTicket || null,
        projectidref: form.value.projectIdRef || null,
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

    const handleItemClick = (item) => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing) return;
      /* wwEditor:end */
      if (item._preview) return;
      emit('trigger-event', { name: 'onItemClick', event: { value: { item } } });
    };

    /* ─── Client display items (with editor preview fallback) ─── */
    const displayItems = computed(() => {
      const items = cmsItems.value;
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing && items.length === 0) return PREVIEW_ITEMS;
      /* wwEditor:end */
      return items;
    });

    /* ─── Labels ─── */
    const getText = (val, fallback) => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwLang?.getText) {
        return wwLib.wwLang.getText(val) || fallback;
      }
      return val || fallback;
    };
    const submitLabel = computed(() => getText(props.content?.submitButtonText, 'Add Item'));
    const resetLabel  = computed(() => getText(props.content?.resetButtonText, 'Reset'));

    /* ─── Formatting ─── */
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
      props,
      isAdmin,
      formVisible,
      form,
      editingId,
      cmsItems,
      clients,
      projects,
      displayItems,
      submitLabel,
      resetLabel,
      toggleForm,
      startEdit,
      cancelEdit,
      handleReset,
      handleSubmit,
      handleDelete,
      handleItemClick,
      formatDate,
      cssVars,
      cardStyles,
      inputBaseStyles,
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

/* ── Admin header ── */
.gdm-cms__admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  gap: 1rem;
}
.gdm-cms__admin-header-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.gdm-cms__admin-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--gdm-accent);
  background: color-mix(in srgb, var(--gdm-accent) 12%, transparent);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
.gdm-cms__admin-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gdm-text);
}

/* ── Form card ── */
.gdm-cms__form-wrap { margin-bottom: 1.5rem; }
.gdm-cms__form-card {
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.gdm-cms__form-card-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
}
.gdm-cms__form-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
.gdm-cms__editing-badge {
  font-size: 0.6875rem;
  color: #f59e0b;
  background: #fef3c7;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}
.gdm-cms__form { display: flex; flex-direction: column; gap: 1.25rem; }

/* ── Sections ── */
.gdm-cms__section { display: flex; flex-direction: column; gap: 0.75rem; }
.gdm-cms__section-label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gdm-label);
  padding-bottom: 0.375rem;
  border-bottom: 1px solid #f1f5f9;
}
.gdm-cms__grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}
.gdm-cms__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  &--full { grid-column: 1 / -1; }
}
.gdm-cms__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--gdm-label);
}
.gdm-cms__required { color: #ef4444; }

.gdm-cms__input,
.gdm-cms__select,
.gdm-cms__textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid var(--gdm-input-border);
  border-radius: 7px;
  font-size: inherit;
  font-family: inherit;
  background-color: var(--gdm-input-bg);
  color: var(--gdm-input-text);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  &:focus {
    border-color: var(--gdm-focus);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--gdm-focus) 20%, transparent);
  }
  &::placeholder { color: #94a3b8; }
}
.gdm-cms__textarea { resize: vertical; min-height: 64px; }

.gdm-cms__form-actions {
  display: flex;
  gap: 0.625rem;
  padding-top: 0.5rem;
}

/* ── Buttons ── */
.gdm-cms__btn {
  padding: 0.5rem 1.125rem;
  border-radius: 7px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s, transform 0.1s;
  &:hover:not(:disabled) { opacity: 0.88; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &--primary {
    background: var(--gdm-accent);
    color: var(--gdm-accent-text);
    border: none;
  }
  &--ghost {
    background: transparent;
    color: #64748b;
    border: 1.5px solid #cbd5e1;
  }
}

/* ── Item list (admin) ── */
.gdm-cms__list { display: flex; flex-direction: column; gap: 0.625rem; }
.gdm-cms__list-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}
.gdm-cms__list-count {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 500;
}
.gdm-cms__item-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: box-shadow 0.15s;
  &:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.08); }
}
.gdm-cms__item-left { flex: 1; min-width: 0; }
.gdm-cms__item-meta { display: flex; gap: 0.375rem; margin-bottom: 0.375rem; flex-wrap: wrap; }
.gdm-cms__item-title { font-weight: 600; font-size: 0.9375rem; margin-bottom: 0.25rem; }
.gdm-cms__item-desc { font-size: 0.8125rem; color: #64748b; line-height: 1.45; margin-bottom: 0.5rem; }
.gdm-cms__item-footer { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; }
.gdm-cms__item-date { font-size: 0.75rem; color: #94a3b8; }

/* Badges */
.gdm-cms__type-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: color-mix(in srgb, var(--gdm-accent) 12%, transparent);
  color: var(--gdm-accent);
}
.gdm-cms__subtype-badge {
  font-size: 0.6875rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 500;
}
.gdm-cms__support-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  &--open { background: #fef3c7; color: #d97706; }
  &--in_progress { background: #eff6ff; color: #2563eb; }
  &--closed { background: #f0fdf4; color: #16a34a; }
}

/* ── Admin actions ── */
.gdm-cms__item-actions {
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
}
.gdm-cms__action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.1s;
  background: transparent;
  &:active { transform: scale(0.92); }
  &--edit { &:hover { background: #eff6ff; } }
  &--delete { &:hover { background: #fef2f2; } }
}

/* ── Client grid ── */
.gdm-cms__client {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}
.gdm-cms__client-card {
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.1s;
  &:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); transform: translateY(-2px); }
  &--preview { opacity: 0.75; }
  padding: 0 !important;
}
.gdm-cms__client-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}
.gdm-cms__client-body { padding: 1rem 1.125rem 1.125rem; }
.gdm-cms__client-meta { display: flex; gap: 0.375rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
.gdm-cms__client-title {
  margin: 0 0 0.375rem;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.35;
}
.gdm-cms__client-desc {
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.gdm-cms__client-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.gdm-cms__client-read {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gdm-accent);
}

/* ── Empty state ── */
.gdm-cms__empty {
  padding: 2.5rem 1rem;
  text-align: center;
  background: #f8fafc;
  border-radius: 10px;
  border: 1.5px dashed #e2e8f0;
}
.gdm-cms__empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.gdm-cms__empty-text { margin: 0 0 0.25rem; font-weight: 600; color: #475569; }
.gdm-cms__empty-sub { margin: 0; font-size: 0.8125rem; color: #94a3b8; }
</style>
