export default {
  editor: {
    label: { en: 'GDM CMS Add' },
    icon: 'pencil',
    customSettingsPropertiesOrder: [
      'disableInteractions',
      { label: 'Basic Info', isCollapsible: true, properties: ['clientsData', 'clientId', 'type', 'subtype', 'title', 'slug'] },
      { label: 'Content', isCollapsible: true, properties: ['shortDescription', 'content', 'imagelink'] },
      { label: 'Support', isCollapsible: true, properties: ['supportDue', 'supportStatus', 'supportTicket'] },
      { label: 'Project', isCollapsible: true, properties: ['projectsData', 'projectIdRef'] },
      { label: 'Form', isCollapsible: true, properties: ['submitButtonText', 'showResetButton', 'resetButtonText'] },
    ],
    customStylePropertiesOrder: [
      { label: 'Card', isCollapsible: true, properties: ['cardBackgroundColor', 'cardBorderRadius', 'cardPadding'] },
      { label: 'Inputs', isCollapsible: true, properties: ['inputBackgroundColor', 'inputBorderColor', 'inputTextColor', 'inputFocusColor'] },
      { label: 'Buttons', isCollapsible: true, properties: ['submitButtonColor', 'submitButtonTextColor', 'resetButtonColor'] },
      { label: 'Typography', isCollapsible: true, properties: ['fontFamily', 'fontSize', 'labelColor'] },
    ],
  },
  triggerEvents: [
    {
      name: 'onSubmit',
      label: { en: 'On submit' },
      event: {
        value: {
          title: null,
          type: null,
          subtype: null,
          slug: null,
          short_description: null,
          content: null,
          client_id: null,
          imagelink: null,
          support_due: null,
          support_status: null,
          support_ticket: null,
          projectidref: null,
        },
      },
      default: true,
    },
  ],
  properties: {
    disableInteractions: {
      label: { en: 'Disable interactions' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'boolean', tooltip: 'When true, form cannot be submitted' },
      /* wwEditor:end */
    },
    clientsData: {
      label: { en: 'Clients list' },
      type: 'ObjectList',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      /* wwEditor:start */
      bindingValidation: { type: 'array', tooltip: 'List of clients for dropdown (client_record)' },
      /* wwEditor:end */
    },
    clientId: {
      label: { en: 'Selected client ID' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'UUID of selected client' },
      /* wwEditor:end */
    },
    type: {
      label: { en: 'Type' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'e.g. changelog, article, documentation' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'CMS type' },
      /* wwEditor:end */
    },
    subtype: {
      label: { en: 'Subtype' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'Optional subtype' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'CMS subtype' },
      /* wwEditor:end */
    },
    title: {
      label: { en: 'Title' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'Article title' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'CMS title' },
      /* wwEditor:end */
    },
    slug: {
      label: { en: 'Slug' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'url-friendly-slug' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'URL slug' },
      /* wwEditor:end */
    },
    shortDescription: {
      label: { en: 'Short description' },
      type: 'Textarea',
      section: 'settings',
      options: { placeholder: 'Brief summary' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Short description' },
      /* wwEditor:end */
    },
    content: {
      label: { en: 'Content' },
      type: 'Textarea',
      section: 'settings',
      options: { placeholder: 'Full content' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Main content' },
      /* wwEditor:end */
    },
    imagelink: {
      label: { en: 'Image link' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'https://...' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Image URL' },
      /* wwEditor:end */
    },
    supportDue: {
      label: { en: 'Support due date' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'YYYY-MM-DD' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Support due date' },
      /* wwEditor:end */
    },
    supportStatus: {
      label: { en: 'Support status' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'e.g. open, closed' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Support status' },
      /* wwEditor:end */
    },
    supportTicket: {
      label: { en: 'Support ticket' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'Ticket reference' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Support ticket ID' },
      /* wwEditor:end */
    },
    projectsData: {
      label: { en: 'Projects list' },
      type: 'ObjectList',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      /* wwEditor:start */
      bindingValidation: { type: 'array', tooltip: 'List of projects for dropdown' },
      /* wwEditor:end */
    },
    projectIdRef: {
      label: { en: 'Project reference' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'UUID of linked project' },
      /* wwEditor:end */
    },
    submitButtonText: {
      label: { en: 'Submit button text' },
      type: 'Text',
      section: 'settings',
      multilang: true,
      defaultValue: 'Add CMS Item',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Submit button label' },
      /* wwEditor:end */
    },
    showResetButton: {
      label: { en: 'Show reset button' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
    },
    resetButtonText: {
      label: { en: 'Reset button text' },
      type: 'Text',
      section: 'settings',
      multilang: true,
      defaultValue: 'Reset',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Reset button label' },
      /* wwEditor:end */
    },
    cardBackgroundColor: {
      label: { en: 'Card background' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Card background color' },
      /* wwEditor:end */
    },
    cardBorderRadius: {
      label: { en: 'Card border radius' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 0, max: 48 }] },
      defaultValue: '12px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Border radius' },
      /* wwEditor:end */
    },
    cardPadding: {
      label: { en: 'Card padding' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 0, max: 64 }] },
      defaultValue: '24px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Card padding' },
      /* wwEditor:end */
    },
    inputBackgroundColor: {
      label: { en: 'Input background' },
      type: 'Color',
      section: 'style',
      defaultValue: '#f8fafc',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Input background' },
      /* wwEditor:end */
    },
    inputBorderColor: {
      label: { en: 'Input border color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#e2e8f0',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Input border' },
      /* wwEditor:end */
    },
    inputTextColor: {
      label: { en: 'Input text color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1e293b',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Input text' },
      /* wwEditor:end */
    },
    inputFocusColor: {
      label: { en: 'Input focus color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#0d9488',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Focus ring color' },
      /* wwEditor:end */
    },
    submitButtonColor: {
      label: { en: 'Submit button color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#0d9488',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Submit button background' },
      /* wwEditor:end */
    },
    submitButtonTextColor: {
      label: { en: 'Submit button text' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Submit button text' },
      /* wwEditor:end */
    },
    resetButtonColor: {
      label: { en: 'Reset button color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#64748b',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Reset button color' },
      /* wwEditor:end */
    },
    fontFamily: {
      label: { en: 'Font family' },
      type: 'FontFamily',
      section: 'style',
      defaultValue: 'DM Sans, system-ui, sans-serif',
      bindable: true,
    },
    fontSize: {
      label: { en: 'Font size' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 12, max: 24 }] },
      defaultValue: '15px',
      bindable: true,
      responsive: true,
    },
    labelColor: {
      label: { en: 'Label color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#475569',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Label text color' },
      /* wwEditor:end */
    },
  },
};
