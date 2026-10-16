document.querySelectorAll('#pdfId').forEach((el) => el.remove());
            var s=document.createElement('script');s.type='text/javascript'; s.async=true;
            s.id = 'pdfId';
            s.src='https://pdf.bestfreecdn.com/storage/js/pdf-5405.js?ver=16';
            document.body.appendChild(s);