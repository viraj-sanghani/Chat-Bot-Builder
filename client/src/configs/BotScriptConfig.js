export const script = `
    <script type="text/javascript">
        (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = '${process.env.REACT_APP_API}/bot/auth/API_KEY';
            s1.id = 'quickConnect';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s1.setAttribute('apiKey', 'API_KEY');
            s0.parentNode.insertBefore(s1, s0);
        })();
    </script>
`;
