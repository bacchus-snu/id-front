const fetcher = (path: string) => fetch(path).then(res => res.json());
export default fetcher;
