import serverCall from './server-call';

export default async (file, setLoading) => {
  if (!file) return;

  setLoading(true);

  const payload = await serverCall('GET', 's3/direct_post').then(res => res);

  const url = payload.url;
  const formData = new FormData();

  Object.keys(payload.fields).forEach(key =>
    formData.append(key, payload.fields[key])
  );
  formData.append('file', file);

  const xml = await fetch(url, {
    method: 'POST',
    body: formData
  }).then(res => res.text());

  const uploadUrl = new DOMParser()
  .parseFromString(xml, 'application/xml')
  .getElementsByTagName('Location')[0].textContent;

  return uploadUrl;
};