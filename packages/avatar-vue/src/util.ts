export function fetchImage(url: string): Promise<string | void> {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image, status: ${response.status}`);
      }

      return response.blob();
    })
    .then((blob) => URL.createObjectURL(blob))
    .catch((error) => console.error(error));
}
