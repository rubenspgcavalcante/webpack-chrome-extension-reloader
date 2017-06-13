/* -------------------------------------------------- */
/*  Start of Webpack Chrome Hot Extension Middleware  */
/* ================================================== */
/*  This will be converted into a lodash templ., any  */
/*  external argument must be provided using it       */
/* -------------------------------------------------- */
(function (chrome, window) {
    const signals: any = JSON.parse('<%= signals %>');
    const reloadPage: boolean = <'true' | 'false'>'<%= reloadPage %>' === "true";
    const wsHost = '<%= WSHost %>';
    const {SIGN_CHANGE, SIGN_RELOAD, SIGN_RELOADED, SIGN_LOG, SIGN_CONNECT} = signals;

    const {runtime, tabs, management} = chrome;
    const manifest = runtime.getManifest();

    const RECONNECT_INTERVAL = 2000;
    const SOCKET_ERR_CODE_REF = 'https://tools.ietf.org/html/rfc6455#section-7.4.1';

    const formatter = (msg: string) => `[ WCER: ${msg} ]`;
    const logger = (msg, level = 'info') => console[level](formatter(msg));
    const dateFormatter = (datetime: number) => `${datetime / 3600}:${datetime / 6000}:${datetime / 1000}`;

    function contentScriptWorker() {
        runtime.sendMessage({type: SIGN_CONNECT}, msg => console.info(msg));

        runtime.onMessage.addListener(({type, payload}: Action) => {
            switch (type) {
                case SIGN_RELOAD:
                    logger('Detected Changes. Reloading ...');
                    reloadPage && window.location.reload();
                    break;

                case SIGN_LOG:
                    console.info(payload);
                    break;
            }
        });
    }

    function backgroundWorker(socket: WebSocket) {
        runtime.onMessage.addListener((action: Action, sender, sendResponse) => {
            if (action.type === SIGN_CONNECT) {
                sendResponse(formatter('Connected to Chrome Extension Hot Reloader'));
            }
        });

        socket.addEventListener('message', ({data}: MessageEvent) => {
            const {type, payload} = JSON.parse(data);

            if (type === SIGN_CHANGE) {
                tabs.query({status: "complete"}, loadedTabs => {
                    loadedTabs.forEach(tab => tabs.sendMessage(tab.id, {type: SIGN_RELOAD}));
                    socket.send(JSON.stringify({
                        type: SIGN_RELOADED,
                        payload: formatter(`${dateFormatter(Date.now())} - ${manifest.name} successfully reloaded`)
                    }));
                    runtime.reload();
                });
            }
            else {
                runtime.sendMessage({type, payload});
            }
        });

        socket.addEventListener('close', ({code}: CloseEvent) => {
            logger(`Socket connection closed. Code ${code}. See more in ${SOCKET_ERR_CODE_REF}`, 'warn');

            const intId = setInterval(() => {
                logger('WEPR Attempting to reconnect ...');
                const ws = new WebSocket(wsHost);
                ws.addEventListener('open', () => {
                    clearInterval(intId);
                    logger('Reconnected. Reloading plugin');
                    runtime.reload();
                });
            }, RECONNECT_INTERVAL);
        });
    }

    runtime.reload ? backgroundWorker(new WebSocket(wsHost)) : contentScriptWorker();
})(chrome, window);
/* ----------------------------------------------- */
/* End of Webpack Chrome Hot Extension Middleware  */
/* ----------------------------------------------- */
