export function excelDownload(
  data?: BlobPart,
  startDate?: string,
  endDate?: string,
  logname?: string,
) {
  const blob = new Blob([data as unknown as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  let dateStr: any;
  const blobURL = window.URL.createObjectURL(blob);

  const tempLink = document.createElement('a');

  if (startDate && endDate) {
    dateStr = startDate.split(' ')[0] + ' - ' + endDate.split(' ')[0];
  } else {
    const errorDate = new Date();
    const year = errorDate.getFullYear();
    const month = ('0' + (errorDate.getMonth() + 1)).slice(-2);
    const day = ('0' + errorDate.getDate()).slice(-2);
    const hours = ('0' + errorDate.getHours()).slice(-2);
    const minutes = ('0' + errorDate.getMinutes()).slice(-2);
    errorDate.toLocaleDateString('ko-kr');
    dateStr = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
  }

  const filename = logname + dateStr + '.xlsx';

  tempLink.href = blobURL;
  tempLink.style.display = 'none';
  tempLink.setAttribute('download', filename);
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);

  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }
}
