const API_URL = '/api/v1/ogrenciler';

const elements = {
  list: document.querySelector('#student-list'),
  loading: document.querySelector('#loading-state'),
  empty: document.querySelector('#empty-state'),
  emptyTitle: document.querySelector('#empty-title'),
  emptyDescription: document.querySelector('#empty-description'),
  listError: document.querySelector('#list-error-state'),
  listErrorMessage: document.querySelector('#list-error-message'),
  total: document.querySelector('#total-students'),
  average: document.querySelector('#average-grade'),
  successRate: document.querySelector('#success-rate'),
  classCount: document.querySelector('#class-count'),
  classSummary: document.querySelector('#class-summary'),
  todayLabel: document.querySelector('#today-label'),
  resultInfo: document.querySelector('#result-info'),
  pageInfo: document.querySelector('#page-info'),
  previousPage: document.querySelector('#previous-page'),
  nextPage: document.querySelector('#next-page'),
  pageSize: document.querySelector('#page-size'),
  search: document.querySelector('#search-input'),
  classFilter: document.querySelector('#class-filter'),
  minGrade: document.querySelector('#min-grade-filter'),
  sort: document.querySelector('#sort-filter'),
  direction: document.querySelector('#sort-direction'),
  activeFilters: document.querySelector('#active-filters'),
  dialog: document.querySelector('#student-dialog'),
  form: document.querySelector('#student-form'),
  formError: document.querySelector('#form-error'),
  dialogTitle: document.querySelector('#dialog-title'),
  save: document.querySelector('#save-button'),
  detailDialog: document.querySelector('#detail-dialog'),
  detailBody: document.querySelector('#detail-body'),
  detailEdit: document.querySelector('#detail-edit'),
  toast: document.querySelector('#toast'),
  sidebarStatusDot: document.querySelector('#sidebar-status-dot'),
  sidebarStatusText: document.querySelector('#sidebar-status-text'),
  appHealthBadge: document.querySelector('#app-health-badge'),
  appHealthDetail: document.querySelector('#app-health-detail'),
  dbHealthBadge: document.querySelector('#db-health-badge'),
  dbHealthDetail: document.querySelector('#db-health-detail'),
  lastHealthCheck: document.querySelector('#last-health-check'),
  healthDuration: document.querySelector('#health-duration'),
  apiEndpoint: document.querySelector('#api-endpoint'),
  apiIdField: document.querySelector('#api-id-field'),
  apiStudentId: document.querySelector('#api-student-id'),
  runApiRequest: document.querySelector('#run-api-request'),
  apiMethod: document.querySelector('#api-method'),
  apiPath: document.querySelector('#api-path'),
  apiResponseMeta: document.querySelector('#api-response-meta'),
  apiOutput: document.querySelector('#api-output code'),
};

const state = {
  students: [],
  page: 1,
  pagination: { toplam: 0, sayfa: 1, limit: 20, toplamSayfa: 1 },
  currentDetail: null,
};

let toastTimer;
let filterTimer;

class ApiRequestError extends Error {
  constructor(message, status, body, duration) {
    super(message);
    this.status = status;
    this.body = body;
    this.duration = duration;
  }
}

const icon = (name) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#icon-${name}`);
  svg.append(use);
  return svg;
};

const formatJson = (value) => JSON.stringify(value, null, 2);

const showApiOutput = ({ method = 'GET', path, status, duration, body }) => {
  elements.apiMethod.textContent = method;
  elements.apiPath.textContent = path;
  elements.apiResponseMeta.textContent = status
    ? `${status} • ${Math.round(duration)} ms`
    : 'Yanıt bekleniyor';
  elements.apiOutput.textContent = formatJson(body);
};

const request = async (path, options = {}, expose = true) => {
  const startedAt = performance.now();
  const method = options.method || 'GET';
  if (expose) {
    elements.apiMethod.textContent = method;
    elements.apiPath.textContent = path;
    elements.apiResponseMeta.textContent = 'İstek gönderiliyor...';
  }

  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch (_error) {
    const duration = performance.now() - startedAt;
    const body = { basarili: false, hata: { mesaj: 'Sunucuya ulaşılamadı' } };
    if (expose) showApiOutput({ method, path, status: 0, duration, body });
    throw new ApiRequestError('Sunucuya ulaşılamadı', 0, body, duration);
  }

  const duration = performance.now() - startedAt;
  const body = await response.json().catch(() => ({
    basarili: false,
    hata: { mesaj: 'Sunucu geçerli bir JSON yanıtı döndürmedi' },
  }));

  if (expose) showApiOutput({ method, path, status: response.status, duration, body });
  if (!response.ok) {
    throw new ApiRequestError(
      body?.hata?.mesaj || body?.durum || 'İşlem tamamlanamadı',
      response.status,
      body,
      duration,
    );
  }
  return { body, status: response.status, duration };
};

const showToast = (message, isError = false) => {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.toggle('error', isError);
  elements.toast.classList.add('visible');
  toastTimer = setTimeout(() => elements.toast.classList.remove('visible'), 2800);
};

const addCell = (row, value = '') => {
  const cell = document.createElement('td');
  cell.textContent = value;
  row.append(cell);
  return cell;
};

const createActionButton = (name, label, className, handler) => {
  const button = document.createElement('button');
  button.className = `row-button ${className}`.trim();
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.append(icon(name));
  button.addEventListener('click', handler);
  return button;
};

const filteredStudents = () => {
  const searchTerm = elements.search.value.trim().toLocaleLowerCase('tr-TR');
  if (!searchTerm) return state.students;
  return state.students.filter((student) => {
    const text = `${student.ad} ${student.soyad} ${student.okul} ${student.email || ''}`
      .toLocaleLowerCase('tr-TR');
    return text.includes(searchTerm);
  });
};

const renderStudents = () => {
  const visibleStudents = filteredStudents();
  elements.list.replaceChildren();
  elements.empty.classList.toggle('hidden', visibleStudents.length !== 0);

  if (visibleStudents.length === 0) {
    const hasSearch = elements.search.value.trim().length > 0;
    const hasRecords = state.pagination.toplam > 0;
    elements.emptyTitle.textContent = hasSearch ? 'Aramanızla eşleşen kayıt yok' : 'Henüz öğrenci yok';
    elements.emptyDescription.textContent = hasSearch
      ? 'Farklı bir isim, e-posta veya okul adı deneyin.'
      : hasRecords ? 'Bu filtrelerde öğrenci bulunamadı.' : 'İlk öğrenci kaydını ekleyerek başlayın.';
  }

  for (const student of visibleStudents) {
    const row = document.createElement('tr');
    const identity = addCell(row);
    const identityWrap = document.createElement('div');
    identityWrap.className = 'student-cell';
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.textContent = `${student.ad?.[0] || ''}${student.soyad?.[0] || ''}`.toLocaleUpperCase('tr-TR');
    const identityText = document.createElement('div');
    const name = document.createElement('button');
    name.type = 'button';
    name.className = 'student-name-button';
    name.textContent = `${student.ad} ${student.soyad}`;
    name.addEventListener('click', () => openDetail(student.id));
    const email = document.createElement('small');
    email.className = 'student-email';
    email.textContent = student.email || 'E-posta belirtilmedi';
    identityText.append(name, email);
    identityWrap.append(avatar, identityText);
    identity.append(identityWrap);

    const classCell = addCell(row);
    const classBadge = document.createElement('span');
    classBadge.className = 'class-badge';
    classBadge.textContent = student.sinif;
    classCell.append(classBadge);
    addCell(row, student.okul);
    addCell(row, String(student.yas));

    const gradeCell = addCell(row);
    const gradeBadge = document.createElement('span');
    const grade = Number(student.notOrtalamasi);
    gradeBadge.className = `grade-badge${grade < 50 ? ' low' : grade < 70 ? ' medium' : ''}`;
    gradeBadge.textContent = grade.toFixed(1);
    gradeCell.append(gradeBadge);

    const actionCell = addCell(row);
    const actions = document.createElement('div');
    actions.className = 'row-actions';
    actions.append(
      createActionButton('eye', `${student.ad} detayını görüntüle`, 'detail-action', () => openDetail(student.id)),
      createActionButton('edit', `${student.ad} kaydını düzenle`, '', () => openDialog(student)),
      createActionButton('trash', `${student.ad} kaydını sil`, 'delete', () => deleteStudent(student)),
    );
    actionCell.append(actions);
    elements.list.append(row);
  }

  const start = state.pagination.toplam === 0 ? 0 : (state.pagination.sayfa - 1) * state.pagination.limit + 1;
  const end = Math.min(start + state.students.length - 1, state.pagination.toplam);
  const searchSuffix = visibleStudents.length !== state.students.length ? ` • aramada ${visibleStudents.length} eşleşme` : '';
  elements.resultInfo.textContent = `${state.pagination.toplam} kayıttan ${start}–${Math.max(end, 0)} gösteriliyor${searchSuffix}`;
};

const updateDashboard = () => {
  const students = state.students;
  const average = students.length
    ? students.reduce((sum, student) => sum + Number(student.notOrtalamasi), 0) / students.length
    : 0;
  const successRate = students.length
    ? Math.round((students.filter((student) => Number(student.notOrtalamasi) >= 70).length / students.length) * 100)
    : 0;
  const classes = [...new Set(students.map((student) => student.sinif))].sort();

  elements.total.textContent = String(state.pagination.toplam);
  elements.average.textContent = students.length ? average.toFixed(1) : '—';
  elements.successRate.textContent = students.length ? `%${successRate}` : '—';
  elements.classCount.textContent = String(classes.length);
  elements.classSummary.textContent = classes.length ? classes.slice(0, 4).join(', ') : 'Bu sayfada sınıf yok';
  elements.pageInfo.textContent = `${state.pagination.sayfa} / ${Math.max(state.pagination.toplamSayfa, 1)}`;
  elements.previousPage.disabled = state.pagination.sayfa <= 1;
  elements.nextPage.disabled = state.pagination.sayfa >= state.pagination.toplamSayfa;
};

const buildListPath = () => {
  const params = new URLSearchParams({
    sayfa: String(state.page),
    limit: elements.pageSize.value,
    siralama: elements.sort.value,
    yon: elements.direction.dataset.direction,
  });
  if (elements.classFilter.value) params.set('sinif', elements.classFilter.value);
  const minGrade = elements.minGrade.value.trim();
  if (minGrade !== '') params.set('minNot', minGrade);
  return `${API_URL}?${params.toString()}`;
};

const renderActiveFilters = () => {
  const filters = [];
  if (elements.classFilter.value) filters.push({ key: 'class', label: `Sınıf: ${elements.classFilter.value}` });
  if (elements.minGrade.value.trim() !== '') filters.push({ key: 'grade', label: `Min. not: ${elements.minGrade.value}` });
  elements.activeFilters.replaceChildren();
  elements.activeFilters.classList.toggle('hidden', filters.length === 0);

  for (const filter of filters) {
    const chip = document.createElement('span');
    chip.className = 'filter-chip';
    chip.append(document.createTextNode(filter.label));
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.setAttribute('aria-label', `${filter.label} filtresini kaldır`);
    clear.append(icon('close'));
    clear.addEventListener('click', () => {
      if (filter.key === 'class') elements.classFilter.value = '';
      if (filter.key === 'grade') elements.minGrade.value = '';
      state.page = 1;
      loadStudents();
    });
    chip.append(clear);
    elements.activeFilters.append(chip);
  }
};

const loadStudents = async () => {
  elements.loading.classList.remove('hidden');
  elements.empty.classList.add('hidden');
  elements.listError.classList.add('hidden');
  renderActiveFilters();
  try {
    const { body } = await request(buildListPath());
    state.students = Array.isArray(body.veri) ? body.veri : [];
    state.pagination = body.sayfalama || { toplam: state.students.length, sayfa: 1, limit: 20, toplamSayfa: 1 };
    state.page = state.pagination.sayfa;
    updateDashboard();
    renderStudents();
  } catch (error) {
    state.students = [];
    elements.list.replaceChildren();
    elements.listErrorMessage.textContent = error.message;
    elements.listError.classList.remove('hidden');
    elements.resultInfo.textContent = 'Veriler alınamadı';
    showToast(error.message, true);
  } finally {
    elements.loading.classList.add('hidden');
  }
};

const setHealthRow = (badge, detail, isHealthy, healthyText, detailText) => {
  badge.textContent = isHealthy ? healthyText : 'Sorun var';
  badge.className = `health-badge${isHealthy ? '' : ' offline'}`;
  detail.textContent = detailText;
};

const loadHealth = async () => {
  elements.appHealthBadge.textContent = 'Kontrol';
  elements.appHealthBadge.className = 'health-badge checking';
  elements.dbHealthBadge.textContent = 'Kontrol';
  elements.dbHealthBadge.className = 'health-badge checking';
  const startedAt = performance.now();
  const [appResult, readyResult] = await Promise.allSettled([
    request('/health', {}, false),
    request('/health/ready', {}, false),
  ]);

  const appOk = appResult.status === 'fulfilled' && appResult.value.body.basarili;
  const readyBody = readyResult.status === 'fulfilled' ? readyResult.value.body : readyResult.reason?.body;
  const dbOk = readyResult.status === 'fulfilled' && readyBody?.basarili;
  const appBody = appResult.status === 'fulfilled' ? appResult.value.body : appResult.reason?.body;

  setHealthRow(
    elements.appHealthBadge,
    elements.appHealthDetail,
    appOk,
    'Çalışıyor',
    appOk ? `Liveness yanıtı: ${appBody.durum}` : (appResult.reason?.message || 'Sunucuya ulaşılamadı'),
  );
  setHealthRow(
    elements.dbHealthBadge,
    elements.dbHealthDetail,
    dbOk,
    'Bağlı',
    dbOk ? `Readiness yanıtı: ${readyBody.veritabani}` : (readyBody?.veritabani || readyResult.reason?.message || 'Bağlantı kurulamadı'),
  );

  elements.sidebarStatusDot.className = `status-dot ${appOk && dbOk ? 'online' : 'offline'}`;
  elements.sidebarStatusText.textContent = appOk && dbOk
    ? 'API ve veritabanı aktif'
    : appOk ? 'API aktif • DB bekleniyor' : 'API bağlantısı yok';
  elements.lastHealthCheck.textContent = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
  elements.healthDuration.textContent = `${Math.round(performance.now() - startedAt)} ms`;
};

const openDialog = (student = null) => {
  elements.form.reset();
  elements.formError.classList.add('hidden');
  document.querySelector('#student-id').value = student?.id || '';
  elements.dialogTitle.textContent = student ? 'Öğrenciyi düzenle' : 'Yeni öğrenci';

  if (student) {
    document.querySelector('#first-name').value = student.ad;
    document.querySelector('#last-name').value = student.soyad;
    document.querySelector('#age').value = student.yas;
    document.querySelector('#student-class').value = student.sinif;
    document.querySelector('#school').value = student.okul;
    document.querySelector('#grade').value = student.notOrtalamasi;
    document.querySelector('#email').value = student.email || '';
  } else {
    document.querySelector('#grade').value = 0;
  }
  elements.dialog.showModal();
};

const closeDialog = () => elements.dialog.close();

const saveStudent = async (event) => {
  event.preventDefault();
  elements.formError.classList.add('hidden');
  elements.save.disabled = true;
  elements.save.textContent = 'Kaydediliyor...';

  const id = document.querySelector('#student-id').value;
  const email = document.querySelector('#email').value.trim();
  const payload = {
    ad: document.querySelector('#first-name').value,
    soyad: document.querySelector('#last-name').value,
    yas: Number(document.querySelector('#age').value),
    sinif: document.querySelector('#student-class').value,
    okul: document.querySelector('#school').value,
    notOrtalamasi: Number(document.querySelector('#grade').value),
    ...(email ? { email } : {}),
  };

  try {
    await request(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(payload),
    });
    closeDialog();
    showToast(id ? 'Öğrenci bilgileri güncellendi' : 'Yeni öğrenci eklendi');
    await loadStudents();
  } catch (error) {
    const details = error.body?.hata?.detaylar;
    elements.formError.textContent = Array.isArray(details) && details.length
      ? details.map((detail) => detail.mesaj || detail.message).filter(Boolean).join(' • ')
      : error.message;
    elements.formError.classList.remove('hidden');
  } finally {
    elements.save.disabled = false;
    elements.save.textContent = 'Kaydet';
  }
};

const deleteStudent = async (student) => {
  if (!window.confirm(`${student.ad} ${student.soyad} adlı öğrenciyi silmek istiyor musunuz?`)) return;
  try {
    await request(`${API_URL}/${student.id}`, { method: 'DELETE' });
    showToast('Öğrenci kaydı silindi');
    if (state.students.length === 1 && state.page > 1) state.page -= 1;
    await loadStudents();
  } catch (error) {
    showToast(error.message, true);
  }
};

const detailItem = (label, value) => {
  const item = document.createElement('div');
  item.className = 'detail-item';
  const small = document.createElement('small');
  small.textContent = label;
  const strong = document.createElement('strong');
  strong.textContent = value || 'Belirtilmedi';
  item.append(small, strong);
  return item;
};

const renderDetail = (student) => {
  elements.detailBody.replaceChildren();
  const identity = document.createElement('div');
  identity.className = 'detail-identity';
  const avatar = document.createElement('span');
  avatar.className = 'avatar';
  avatar.textContent = `${student.ad[0]}${student.soyad[0]}`.toLocaleUpperCase('tr-TR');
  const text = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = `${student.ad} ${student.soyad}`;
  const subtitle = document.createElement('p');
  subtitle.textContent = `${student.sinif} • ${student.okul}`;
  text.append(title, subtitle);
  identity.append(avatar, text);

  const grid = document.createElement('div');
  grid.className = 'detail-grid';
  const dateFormatter = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  grid.append(
    detailItem('Yaş', String(student.yas)),
    detailItem('Not ortalaması', Number(student.notOrtalamasi).toFixed(1)),
    detailItem('E-posta', student.email),
    detailItem('Durum', student.aktifMi ? 'Aktif' : 'Pasif'),
    detailItem('Kayıt tarihi', student.createdAt ? dateFormatter.format(new Date(student.createdAt)) : '—'),
    detailItem('Son güncelleme', student.updatedAt ? dateFormatter.format(new Date(student.updatedAt)) : '—'),
  );
  elements.detailBody.append(identity, grid);
};

const openDetail = async (id) => {
  try {
    const { body } = await request(`${API_URL}/${id}`);
    state.currentDetail = body.veri;
    renderDetail(body.veri);
    elements.detailDialog.showModal();
  } catch (error) {
    showToast(error.message, true);
  }
};

const closeDetail = () => elements.detailDialog.close();

const endpointPath = () => {
  switch (elements.apiEndpoint.value) {
    case 'detail': return `${API_URL}/${elements.apiStudentId.value.trim()}`;
    case 'health': return '/health';
    case 'ready': return '/health/ready';
    default: return `${API_URL}?limit=5&siralama=notOrtalamasi&yon=desc`;
  }
};

const updateApiEndpoint = () => {
  const isDetail = elements.apiEndpoint.value === 'detail';
  elements.apiIdField.classList.toggle('hidden', !isDetail);
  const path = endpointPath();
  elements.apiPath.textContent = isDetail && !elements.apiStudentId.value.trim()
    ? `${API_URL}/:id`
    : path;
  elements.apiResponseMeta.textContent = 'Hazır';
};

const runApiExplorer = async () => {
  const isDetail = elements.apiEndpoint.value === 'detail';
  const id = elements.apiStudentId.value.trim();
  if (isDetail && !/^[0-9a-fA-F]{24}$/.test(id)) {
    showToast('Geçerli, 24 karakterli bir öğrenci ID girin', true);
    elements.apiStudentId.focus();
    return;
  }
  elements.runApiRequest.disabled = true;
  try {
    await request(endpointPath());
  } catch (error) {
    showToast(error.message, true);
  } finally {
    elements.runApiRequest.disabled = false;
  }
};

const setToday = () => {
  elements.todayLabel.textContent = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric', month: 'long', weekday: 'long',
  }).format(new Date());
};

document.querySelector('#add-button').addEventListener('click', () => openDialog());
document.querySelector('#empty-add-button').addEventListener('click', () => openDialog());
document.querySelector('#close-dialog').addEventListener('click', closeDialog);
document.querySelector('#cancel-button').addEventListener('click', closeDialog);
document.querySelector('#refresh-button').addEventListener('click', loadStudents);
document.querySelector('#retry-button').addEventListener('click', loadStudents);
document.querySelector('#health-refresh').addEventListener('click', loadHealth);
document.querySelector('#close-detail').addEventListener('click', closeDetail);
document.querySelector('#detail-close-button').addEventListener('click', closeDetail);
elements.detailEdit.addEventListener('click', () => {
  const student = state.currentDetail;
  closeDetail();
  if (student) openDialog(student);
});
elements.form.addEventListener('submit', saveStudent);
elements.search.addEventListener('input', renderStudents);
elements.classFilter.addEventListener('change', () => { state.page = 1; loadStudents(); });
elements.sort.addEventListener('change', () => { state.page = 1; loadStudents(); });
elements.pageSize.addEventListener('change', () => { state.page = 1; loadStudents(); });
elements.minGrade.addEventListener('input', () => {
  clearTimeout(filterTimer);
  filterTimer = setTimeout(() => { state.page = 1; loadStudents(); }, 420);
});
elements.direction.addEventListener('click', () => {
  const next = elements.direction.dataset.direction === 'asc' ? 'desc' : 'asc';
  elements.direction.dataset.direction = next;
  elements.direction.classList.toggle('desc', next === 'desc');
  elements.direction.setAttribute('aria-label', next === 'asc' ? 'Artan sıralama' : 'Azalan sıralama');
  state.page = 1;
  loadStudents();
});
elements.previousPage.addEventListener('click', () => { if (state.page > 1) { state.page -= 1; loadStudents(); } });
elements.nextPage.addEventListener('click', () => { if (state.page < state.pagination.toplamSayfa) { state.page += 1; loadStudents(); } });
elements.dialog.addEventListener('click', (event) => { if (event.target === elements.dialog) closeDialog(); });
elements.detailDialog.addEventListener('click', (event) => { if (event.target === elements.detailDialog) closeDetail(); });
elements.apiEndpoint.addEventListener('change', updateApiEndpoint);
elements.apiStudentId.addEventListener('input', updateApiEndpoint);
elements.runApiRequest.addEventListener('click', runApiExplorer);
document.querySelector('#copy-api-output').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(elements.apiOutput.textContent);
    showToast('API çıktısı panoya kopyalandı');
  } catch (_error) {
    showToast('Çıktı kopyalanamadı', true);
  }
});

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
  });
});

setToday();
updateApiEndpoint();
Promise.allSettled([loadStudents(), loadHealth()]);
setInterval(loadHealth, 60_000);
