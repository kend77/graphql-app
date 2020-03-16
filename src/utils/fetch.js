export default async function fetch(input, init = {}) {
  const res = await window.fetch(input, init);
  return res.json();
}
