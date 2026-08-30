const API_URL = '/api/v1/ogrenciler';

const elements = {
  list: document.querySelector('#student-list'),
  loading: document.querySelector('#loading-state'),
  empty: document.querySelector('#empty-state'),
  total: document.querySelector('#total-students'),
  average: document.querySelector('#average-grade'),
  classCount: document.querySelector('#class-count'),
  resultInfo: document.querySelector('#result-info'),
  search: document.querySelector('#search-input'),
  classFilter: document.querySelector('#class-filter'),
  dialog: document.querySelector('#student-dialog'),
  form: document.querySelector('#student-form'),
  formError: document.querySelector('#form-error'),
  title: document.querySelector('#dialog-title'),
  save: document.querySelector('#save-button'),
  toast: document.querySelector('#toast'),
  apiStatus: document.querySelector('#api-status'),
  statusDot: document.querySelector('.status-dot'),
};

let students = [];
let toastTimer;

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.hata?.mesaj || 'İşlem tamamlanamadı');
  }
  return body;
};

const showToast = (message, isError = false) => {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.toggle('error', isError);
  elements.toast.classList.add('visible');
  toastTimer = setTimeout(() => elements.toast.classList.remove('visible'), 2600);
};

const addCell = (row, value, className) => {
  const cell = document.createElement('td');
  if (className) cell.className = className;
  cell.textContent = value;
  row.append(cell);
  return cell;
};

const renderStudents = () => {
  const searchTerm = elements.search.value.trim().toLocaleLowerCase('tr-TR');
  const selectedClass = elements.classFilter.value;
  const filtered = students.filter((student) => {
    const text = `${student.ad} ${student.soyad} ${student.okul}`.toLocaleLowerCase('tr-TR');
    return text.includes(searchTerm) && (!selectedClass || student.sinif === selectedClass);
  });

  elements.list.replaceChildren();
  elements.empty.classList.toggle('hidden', filtered.length !== 0 || students.length !== 0);

  for (const student of filtered) {
    const row = document.createElement('tr');

    const identity = document.createElement('td');
    const identityWrap = document.createElement('div');
    identityWrap.className = 'student-cell';
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.textContent = `${student.ad[0]}${student.soyad[0]}`.toLocaleUpperCase('tr-TR');
    const identityText = document.createElement('div');
    const name = document.createElement('span');
    name.className = 'student-name';
    name.textContent = `${student.ad} ${student.soyad}`;
    const email = document.createElement('small');
    email.className = 'student-email';
    email.textContent = student.email || 'E-posta belirtilmedi';
    identityText.append(name, email);
    identityWrap.append(avatar, identityText);
    identity.append(identityWrap);
    row.append(identity);

    const classCell = addCell(row, '');
    const classBadge = document.createElement('span');
    classBadge.className = 'class-badge';
    classBadge.textContent = student.sinif;
    classCell.append(classBadge);

    addCell(row, student.okul);
    addCell(row, String(student.yas));

    const gradeCell = addCell(row, '');
    const gradeBadge = document.createElement('span');
    gradeBadge.className = `grade-badge${student.notOrtalamasi < 50 ? ' low' : student.notOrtalamasi < 70 ? ' medium' : ''}`;
    gradeBadge.textContent = Number(student.notOrtalamasi).toFixed(1);
    gradeCell.append(gradeBadge);

    const actionCell = addCell(row, '');
    const actions = document.createElement('div');
    actions.className = 'row-actions';
    const editButton = document.createElement('button');
    editButton.className = 'row-button';
    editButton.type = 'button';
    editButton.textContent = 'Düzenle';
    editButton.addEventListener('click', () => openDialog(student));
    const deleteButton = document.createElement('button');
    deleteButton.className = 'row-button delete';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Sil';
    deleteButton.addEventListener('click', () => deleteStudent(student));
    actions.append(editButton, deleteButton);
    actionCell.append(actions);

    elements.list.append(row);
  }

  elements.resultInfo.textContent = `${filtered.length} öğrenci gösteriliyor`;
};

const updateDashboard = () => {
  elements.total.textContent = String(students.length);
  const average = students.length
    ? students.reduce((sum, student) => sum + Number(student.notOrtalamasi), 0) / students.length
    : 0;
  elements.average.textContent = students.length ? average.toFixed(1) : '—';
  elements.classCount.textContent = String(new Set(students.map((student) => student.sinif)).size);

  const currentValue = elements.classFilter.value;
  const classes = [...new Set(students.map((student) => student.sinif))].sort();
  elements.classFilter.replaceChildren(new Option('Tümü', ''));
  for (const className of classes) elements.classFilter.add(new Option(className, className));
  elements.classFilter.value = classes.includes(currentValue) ? currentValue : '';
};

const loadStudents = async () => {
  elements.loading.classList.remove('hidden');
  elements.empty.classList.add('hidden');
  try {
    const response = await request(`${API_URL}?limit=100&siralama=ad&yon=asc`);
    students = response.veri;
    updateDashboard();
    renderStudents();
    elements.apiStatus.textContent = 'Bağlantı aktif';
    elements.statusDot.className = 'status-dot online';
  } catch (error) {
    elements.apiStatus.textContent = 'Bağlantı kurulamadı';
    elements.statusDot.className = 'status-dot offline';
    elements.resultInfo.textContent = 'Veriler alınamadı';
    showToast(error.message, true);
  } finally {
    elements.loading.classList.add('hidden');
  }
};

const openDialog = (student = null) => {
  elements.form.reset();
  elements.formError.classList.add('hidden');
  document.querySelector('#student-id').value = student?.id || '';
  elements.title.textContent = student ? 'Öğrenciyi düzenle' : 'Yeni öğrenci';

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
    showToast(id ? 'Öğrenci güncellendi' : 'Öğrenci eklendi');
    await loadStudents();
  } catch (error) {
    elements.formError.textContent = error.message;
    elements.formError.classList.remove('hidden');
  } finally {
    elements.save.disabled = false;
    elements.save.textContent = 'Kaydet';
  }
};

const deleteStudent = async (student) => {
  if (!confirm(`${student.ad} ${student.soyad} adlı öğrenciyi silmek istiyor musunuz?`)) return;
  try {
    await request(`${API_URL}/${student.id}`, { method: 'DELETE' });
    showToast('Öğrenci silindi');
    await loadStudents();
  } catch (error) {
    showToast(error.message, true);
  }
};

document.querySelector('#add-button').addEventListener('click', () => openDialog());
document.querySelector('#empty-add-button').addEventListener('click', () => openDialog());
document.querySelector('#close-dialog').addEventListener('click', closeDialog);
document.querySelector('#cancel-button').addEventListener('click', closeDialog);
document.querySelector('#refresh-button').addEventListener('click', loadStudents);
elements.form.addEventListener('submit', saveStudent);
elements.search.addEventListener('input', renderStudents);
elements.classFilter.addEventListener('change', renderStudents);
elements.dialog.addEventListener('click', (event) => {
  if (event.target === elements.dialog) closeDialog();
});

loadStudents();
