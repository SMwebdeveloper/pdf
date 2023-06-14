const prepareIframe = (type, setProp) => (data) =>
  new Promise((resolve, reject) => {
    if (!data) {
      console.error("no data to print");
      return reject("no data to print");
    }
    const iframe = document.createElement("iframe");
    iframe.onload = () => resolve(iframe.contentWindow?.print());
    setProp(iframe, data);
    iframe.className = `${type}-iframe`;
    iframe.style.visibility = "hidden";
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.zIndex = "-1";
    iframe.onabort = iframe.oncancel = iframe.onerror = reject;
    document.body.appendChild(iframe);
  });
const printFile = prepareIframe(
  "file",
  (iframe, file) => (iframe.src = URL.createObjectURL(file))
);
const base64toBlob = (dataURI, type) => {
  const byteString = atob(dataURI.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type });
};

const printPdf = (data) => {
  const type = "application/pdf";
  const pdf = `data:${type};base64,${data}`;
  printFile(base64toBlob(pdf, type));
};

