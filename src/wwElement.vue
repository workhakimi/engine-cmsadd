<template>
  <div class="gdm-cms-add" :style="wrapperStyles">
    <div class="gdm-cms-add__card" :style="cardStyles">
      <form class="gdm-cms-add__form" @submit.prevent="handleSubmit">
        <!-- Basic Info -->
        <div class="gdm-cms-add__section">
          <h3 class="gdm-cms-add__section-title">Basic Info</h3>
          <div class="gdm-cms-add__grid">
            <div v-if="clients.length > 0" class="gdm-cms-add__field">
              <label class="gdm-cms-add__label">Client</label>
              <select
                v-model="form.clientId"
                class="gdm-cms-add__select"
                :style="inputStyles"
                :disabled="content?.disableInteractions"
              >
                <option value="">Select client</option>
                <option v-for="c in clients" :key="c.id" :value="c.id">
                  {{ c.company_name || c.contact_name || c.id }}
                </option>
              </select>
            </div>
            <div class="gdm-cms-add__field">
              <label class="gdm-cms-add__label">Type</label>
              <input
                v-model="form.type"
                type="text"
                class="gdm-cms-add__input"
                :style="inputStyles"
                placeholder="e.g. changelog, article, documentation"
                :disabled="content?.disableInteractions"
              />
            </div>
            <div class="gdm-cms-add__field">
              <label class="gdm-cms-add__label">Subtype</label>
              <input
                v-model="form.subtype"
                type="text"
                class="gdm-cms-add__input"
                :style="inputStyles"
                placeholder="Optional subtype"
                :disabled="content?.disableInteractions"
              />
            </div>
            <div class="gdm-cms-add__field gdm-cms-add__field--full">
              <label class="gdm-cms-add__label">Title</label>
              <input
                v-model="form.title"
                type="text"
                class="gdm-cms-add__input"
                :style="inputStyles"
                placeholder="Article title"
                :disabled="content?.disableInteractions"
              />
            </div>
            <div class="gdm-cms-add__field gdm-cms-add__field--full">
              <label class="gdm-cms-add__label">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                class="gdm-cms-add__input"
                :style="inputStyles"
                placeholder="url-friendly-slug"
                :disabled="content?.disableInteractions"
              />
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="gdm-cms-add__section">
          <h3 class="gdm-cms-add__section-title">Content</h3>
          <div class="gdm-cms-add__fields">
            <div class="gdm-cms-add__field">
              <label class="gdm-cms-add__label">Short description</label>
              <textarea
                v-model="form.shortDescription"
                class="gdm-cms-add__textarea"
                :style="inputStyles"
                rows="2"
                placeholder="Brief summary"
                :disabled="content?.disableInteractions"
              />
            </div>
            <div class="gdm-cms-add__field">
              <label class="gdm-cms-add__label">Content</label>
              <textarea
                v-model="form.content"
                class="gdm-cms-add__textarea"
                :style="inputStyles"
                rows="5"
                placeholder="Full content"
                :disabled="content?.disableInteractions"
              />
            </div>
            <div class="gdm-cms-add__field">
              <label class="gdm-cms-add__label">Image link</label>
              <input
                v-model="form.imagelink"
                type="text"
                class="gdm-cms-add__input"
                :style="inputStyles"
                placeholder="https://..."
                :disabled="content?.disableInteractions"
              />
            </div>
          </div>
        </div>

        <!-- Support -->
        <div class="gdm-cms-add__section">
          <h3 class="gdm-cms-add__section-title">Support</h3>
          <div class="gdm-cms-add__grid">
            <div class="gdm-cms-add__field">
              <label class="gdm-cms-add__label">Support due date</label>
              <input
                v-model="form.supportDue"
                type="text"
                class="gdm-cms-add__input"
                :style="inputStyles"
                placeholder="YYYY-MM-DD"
                :disabled="content?.disableInteractions"
              />
            </div>
            <div class="gdm-cms-add__field">
              <label class="gdm-cms-add__label">Support status</label>
              <input
                v-model="form.supportStatus"
                type="text"
                class="gdm-cms-add__input"
                :style="inputStyles"
                placeholder="e.g. open, closed"
                :disabled="content?.disableInteractions"
              />
            </div>
            <div class="gdm-cms-add__field gdm-cms-add__field--full">
              <label class="gdm-cms-add__label">Support ticket</label>
              <input
                v-model="form.supportTicket"
                type="text"
                class="gdm-cms-add__input"
                :style="inputStyles"
                placeholder="Ticket reference"
                :disabled="content?.disableInteractions"
              />
            </div>
          </div>
        </div>

        <!-- Project -->
        <div v-if="projects.length > 0" class="gdm-cms-add__section">
          <h3 class="gdm-cms-add__section-title">Project</h3>
          <div class="gdm-cms-add__field">
            <label class="gdm-cms-add__label">Linked project</label>
            <select
              v-model="form.projectIdRef"
              class="gdm-cms-add__select"
              :style="inputStyles"
              :disabled="content?.disableInteractions"
            >
              <option value="">None</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">
                {{ p.title || p.id }}
              </option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="gdm-cms-add__actions">
          <button
            type="submit"
            class="gdm-cms-add__btn gdm-cms-add__btn--primary"
            :style="submitButtonStyles"
            :disabled="content?.disableInteractions"
          >
            {{ submitLabel }}
          </button>
          <button
            v-if="content?.showResetButton"
            type="button"
            class="gdm-cms-add__btn gdm-cms-add__btn--reset"
            :style="resetButtonStyles"
            :disabled="content?.disableInteractions"
            @click="handleReset"
          >
            {{ resetLabel }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'GdmCmsAdd',
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const clients = computed(() => {
      const data = props.content?.clientsData;
      if (!data) return [];
      const arr = typeof wwLib !== 'undefined' && wwLib?.wwUtils?.getDataFromCollection
        ? wwLib.wwUtils.getDataFromCollection(data)
        : props.content?.clientsData;
      return Array.isArray(arr) ? arr : [];
    });

    const projects = computed(() => {
      const data = props.content?.projectsData;
      if (!data) return [];
      const arr = typeof wwLib !== 'undefined' && wwLib?.wwUtils?.getDataFromCollection
        ? wwLib.wwUtils.getDataFromCollection(data)
        : props.content?.projectsData;
      return Array.isArray(arr) ? arr : [];
    });

    const form = ref({
      clientId: '',
      type: '',
      subtype: '',
      title: '',
      slug: '',
      shortDescription: '',
      content: '',
      imagelink: '',
      supportDue: '',
      supportStatus: '',
      supportTicket: '',
      projectIdRef: '',
    });

    const initForm = () => {
      form.value = {
        clientId: props.content?.clientId ?? '',
        type: props.content?.type ?? '',
        subtype: props.content?.subtype ?? '',
        title: props.content?.title ?? '',
        slug: props.content?.slug ?? '',
        shortDescription: props.content?.shortDescription ?? '',
        content: props.content?.content ?? '',
        imagelink: props.content?.imagelink ?? '',
        supportDue: props.content?.supportDue ?? '',
        supportStatus: props.content?.supportStatus ?? '',
        supportTicket: props.content?.supportTicket ?? '',
        projectIdRef: props.content?.projectIdRef ?? '',
      };
    };

    initForm();
    watch(() => props.content, initForm, { deep: true });

    const submitLabel = computed(() => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwLang?.getText) {
        return wwLib.wwLang.getText(props.content?.submitButtonText) || 'Add CMS Item';
      }
      return props.content?.submitButtonText || 'Add CMS Item';
    });

    const resetLabel = computed(() => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwLang?.getText) {
        return wwLib.wwLang.getText(props.content?.resetButtonText) || 'Reset';
      }
      return props.content?.resetButtonText || 'Reset';
    });

    const handleSubmit = () => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing || props.content?.disableInteractions) return;
      /* wwEditor:end */
      if (props.content?.disableInteractions) return;

      emit('trigger-event', {
        name: 'onSubmit',
        event: {
          value: {
            title: form.value.title,
            type: form.value.type,
            subtype: form.value.subtype,
            slug: form.value.slug,
            short_description: form.value.shortDescription,
            content: form.value.content,
            client_id: form.value.clientId || null,
            imagelink: form.value.imagelink || null,
            support_due: form.value.supportDue || null,
            support_status: form.value.supportStatus || null,
            support_ticket: form.value.supportTicket || null,
            projectidref: form.value.projectIdRef || null,
          },
        },
      });
    };

    const handleReset = () => {
      if (props.content?.disableInteractions) return;
      initForm();
    };

    const wrapperStyles = computed(() => ({
      fontFamily: props.content?.fontFamily || 'DM Sans, system-ui, sans-serif',
      fontSize: props.content?.fontSize || '15px',
      '--label-color': props.content?.labelColor || '#475569',
    }));

    const cardStyles = computed(() => ({
      backgroundColor: props.content?.cardBackgroundColor || '#ffffff',
      borderRadius: props.content?.cardBorderRadius || '12px',
      padding: props.content?.cardPadding || '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }));

    const inputStyles = computed(() => ({
      backgroundColor: props.content?.inputBackgroundColor || '#f8fafc',
      borderColor: props.content?.inputBorderColor || '#e2e8f0',
      color: props.content?.inputTextColor || '#1e293b',
      '--focus-color': props.content?.inputFocusColor || '#0d9488',
    }));

    const submitButtonStyles = computed(() => ({
      backgroundColor: props.content?.submitButtonColor || '#0d9488',
      color: props.content?.submitButtonTextColor || '#ffffff',
    }));

    const resetButtonStyles = computed(() => ({
      color: props.content?.resetButtonColor || '#64748b',
      borderColor: props.content?.resetButtonColor || '#64748b',
    }));

    return {
      form,
      clients,
      projects,
      submitLabel,
      resetLabel,
      handleSubmit,
      handleReset,
      wrapperStyles,
      cardStyles,
      inputStyles,
      submitButtonStyles,
      resetButtonStyles,
    };
  },
};
</script>

<style lang="scss" scoped>
.gdm-cms-add {
  width: 100%;
  max-width: 640px;
}

.gdm-cms-add__card {
  border: 1px solid #e2e8f0;
}

.gdm-cms-add__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.gdm-cms-add__section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gdm-cms-add__section-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--label-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gdm-cms-add__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.gdm-cms-add__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &--full {
    grid-column: 1 / -1;
  }
}

.gdm-cms-add__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--label-color);
}

.gdm-cms-add__input,
.gdm-cms-add__select,
.gdm-cms-add__textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid;
  border-radius: 6px;
  font-size: inherit;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--focus-color);
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.gdm-cms-add__textarea {
  resize: vertical;
  min-height: 60px;
}

.gdm-cms-add__fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gdm-cms-add__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.gdm-cms-add__btn {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.02s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &--primary {
    border: none;
  }

  &--reset {
    background: transparent;
    border: 1px solid;
  }
}
</style>
