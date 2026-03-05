export default {
  editor: {
    label: { en: 'GDM CMS Manager' },
    icon: 'pencil',
    customSettingsPropertiesOrder: [
      'viewMode',
      { label: 'Data', isCollapsible: true, properties: ['cmsData', 'clientsData', 'projectsData', 'clientId'] },
      { label: 'Comments', isCollapsible: true, properties: ['showComments', 'commsData', 'usersData', 'currentUserId'] },
      { label: 'Pre-fill / Edit', isCollapsible: true, properties: ['clientId', 'type', 'subtype', 'title', 'shortDescription', 'content', 'imagelink', 'supportDue', 'supportStatus', 'supportTicket', 'projectIdRef'] },
      { label: 'Form settings', isCollapsible: true, properties: ['showForm', 'submitButtonText', 'showResetButton', 'resetButtonText'] },
    ],
    customStylePropertiesOrder: [
      { label: 'Card', isCollapsible: true, properties: ['cardBackgroundColor', 'cardBorderRadius', 'cardPadding'] },
      { label: 'Comments', isCollapsible: true, properties: ['commentsMaxHeight'] },
      { label: 'Inputs', isCollapsible: true, properties: ['inputBackgroundColor', 'inputBorderColor', 'inputTextColor', 'inputFocusColor'] },
      { label: 'Buttons', isCollapsible: true, properties: ['accentColor', 'accentTextColor', 'dangerColor'] },
      { label: 'Typography', isCollapsible: true, properties: ['fontFamily', 'fontSize', 'labelColor', 'textColor'] },
    ],
  },
  triggerEvents: [
    {
      name: 'onAddComment',
      label: { en: 'On add comment' },
      event: { value: { message: null, cms_id: null, user_id: null } },
    },
    {
      name: 'onDeleteComment',
      label: { en: 'On delete comment' },
      event: { value: { id: null, message: null } },
    },
    {
      name: 'onSubmit',
      label: { en: 'On add item' },
      event: { value: { title: null, type: null, subtype: null, short_description: null, content: null, client_id: null, imagelink: null, support_due: null, support_status: null, support_ticket: null, projectidref: null } },
      default: true,
    },
    {
      name: 'onUpdate',
      label: { en: 'On update item' },
      event: { value: { id: null, title: null, type: null, subtype: null, short_description: null, content: null, client_id: null, imagelink: null, support_due: null, support_status: null, support_ticket: null, projectidref: null } },
    },
    {
      name: 'onDeleteItem',
      label: { en: 'On delete item' },
      event: { value: { id: null, title: null } },
    },
    {
      name: 'onItemClick',
      label: { en: 'On item click (client)' },
      event: { value: { item: null } },
    },
    {
      name: 'onSubmitTicket',
      label: { en: 'On submit ticket (support)' },
      event: { value: { title: null, type: null, subtype: null, content: null, client_id: null, support_due: null, support_status: null, support_ticket: null, projectidref: null, created_at: null, updated_at: null } },
    },
    {
      name: 'onUpdateTicket',
      label: { en: 'On update ticket (support admin)' },
      event: { value: { id: null, title: null, type: null, subtype: null, content: null, client_id: null, support_due: null, support_status: null, support_ticket: null, projectidref: null, created_at: null, updated_at: null } },
    },
  ],
  properties: {
    viewMode: {
      label: { en: 'View mode' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'admin', label: { en: 'Admin – Add / Edit / Delete' } },
          { value: 'client', label: { en: 'Client – Compact accordion list' } },
          { value: 'client-scroll', label: { en: 'Client – Scroll feed (release notes)' } },
          { value: 'support-admin', label: { en: 'Support – Admin manage tickets' } },
          { value: 'support-client', label: { en: 'Support – Client submit ticket' } },
        ],
      },
      defaultValue: 'admin',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: '"admin", "client", "client-scroll", "support-admin", or "support-client"' },
      /* wwEditor:end */
    },
    cmsData: {
      label: { en: 'CMS items (list)' },
      type: 'ObjectList',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      /* wwEditor:start */
      bindingValidation: { type: 'array', tooltip: 'List of CMS rows from Supabase' },
      /* wwEditor:end */
    },
    clientsData: {
      label: { en: 'Clients list (for dropdown)' },
      type: 'ObjectList',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      /* wwEditor:start */
      bindingValidation: { type: 'array', tooltip: 'List of client_record rows' },
      /* wwEditor:end */
    },
    projectsData: {
      label: { en: 'Projects list (for dropdown)' },
      type: 'ObjectList',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      /* wwEditor:start */
      bindingValidation: { type: 'array', tooltip: 'List of projects rows' },
      /* wwEditor:end */
    },
    clientId: {
      label: { en: 'Default client ID' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill client UUID' },
      /* wwEditor:end */
    },
    type: {
      label: { en: 'Default type' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'e.g. changelog, article, documentation' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill type' },
      /* wwEditor:end */
    },
    subtype: {
      label: { en: 'Default subtype' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'Optional' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill subtype' },
      /* wwEditor:end */
    },
    title: {
      label: { en: 'Default title' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill title' },
      /* wwEditor:end */
    },
    shortDescription: {
      label: { en: 'Default short description' },
      type: 'Textarea',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill short description' },
      /* wwEditor:end */
    },
    content: {
      label: { en: 'Default content' },
      type: 'Textarea',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill content' },
      /* wwEditor:end */
    },
    imagelink: {
      label: { en: 'Default image link' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill image URL' },
      /* wwEditor:end */
    },
    supportDue: {
      label: { en: 'Default support due date' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'YYYY-MM-DD' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill support due date' },
      /* wwEditor:end */
    },
    supportStatus: {
      label: { en: 'Default support status' },
      type: 'Text',
      section: 'settings',
      options: { placeholder: 'e.g. open, closed' },
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill support status' },
      /* wwEditor:end */
    },
    supportTicket: {
      label: { en: 'Default support ticket' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill support ticket' },
      /* wwEditor:end */
    },
    projectIdRef: {
      label: { en: 'Default project reference' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Pre-fill project UUID' },
      /* wwEditor:end */
    },
    showComments: {
      label: { en: 'Enable comment section' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      hidden: (content) => content.viewMode === 'admin',
    },
    commsData: {
      label: { en: 'Comments data (all items)' },
      type: 'ObjectList',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      hidden: (content) => content.viewMode === 'admin' || content.showComments === false,
      /* wwEditor:start */
      bindingValidation: { type: 'array', tooltip: 'All comms_log rows — filtered per article by cms_id client-side' },
      /* wwEditor:end */
    },
    usersData: {
      label: { en: 'Users data (for names)' },
      type: 'ObjectList',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      hidden: (content) => content.viewMode === 'admin' || content.showComments === false,
      /* wwEditor:start */
      bindingValidation: { type: 'array', tooltip: 'user_record rows — used to resolve user display names' },
      /* wwEditor:end */
    },
    currentUserId: {
      label: { en: 'Current user ID' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      hidden: (content) => content.viewMode === 'admin' || content.showComments === false,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'UUID of the logged-in user (for posting comments)' },
      /* wwEditor:end */
    },
    commentsMaxHeight: {
      label: { en: 'Comments scroll max height' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 120, max: 600 }] },
      defaultValue: '280px',
      bindable: true,
      hidden: (content) => content.viewMode === 'admin' || content.showComments === false,
    },
    showForm: {
      label: { en: 'Show form by default' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      hidden: (content) => content.viewMode !== 'admin',
    },
    submitButtonText: {
      label: { en: 'Add button text' },
      type: 'Text',
      section: 'settings',
      multilang: true,
      defaultValue: 'Add Item',
      bindable: true,
      hidden: (content) => content.viewMode !== 'admin',
    },
    showResetButton: {
      label: { en: 'Show reset button' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      hidden: (content) => content.viewMode !== 'admin',
    },
    resetButtonText: {
      label: { en: 'Reset button text' },
      type: 'Text',
      section: 'settings',
      multilang: true,
      defaultValue: 'Reset',
      bindable: true,
      hidden: (content) => content.viewMode !== 'admin',
    },
    cardBackgroundColor: {
      label: { en: 'Card background' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Card background' },
      /* wwEditor:end */
    },
    cardBorderRadius: {
      label: { en: 'Card border radius' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 0, max: 24 }] },
      defaultValue: '12px',
      bindable: true,
    },
    cardPadding: {
      label: { en: 'Card padding' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 0, max: 48 }] },
      defaultValue: '24px',
      bindable: true,
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
      label: { en: 'Focus / accent color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#0d9488',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Focus ring and link color' },
      /* wwEditor:end */
    },
    accentColor: {
      label: { en: 'Primary button color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#0d9488',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Primary action button color' },
      /* wwEditor:end */
    },
    accentTextColor: {
      label: { en: 'Primary button text' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Primary button text color' },
      /* wwEditor:end */
    },
    dangerColor: {
      label: { en: 'Delete button color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ef4444',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Delete action color' },
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
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Form label color' },
      /* wwEditor:end */
    },
    textColor: {
      label: { en: 'Text color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1e293b',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Main text color' },
      /* wwEditor:end */
    },
  },
};
