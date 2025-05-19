declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[] | [number, number, number, number];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    enableLinks?: boolean;
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string | 'portrait' | 'landscape';
    };
  }

  interface Html2Pdf {
    from(element: HTMLElement | string): Html2Pdf;
    set(options: Html2PdfOptions): Html2Pdf;
    save(): Promise<void>;
    output(type: string, options?: any): Promise<any>;
    then(callback: Function): Html2Pdf;
    catch(callback: Function): Html2Pdf;
  }

  function html2pdf(): Html2Pdf;
  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2Pdf;

  export default html2pdf;
}
