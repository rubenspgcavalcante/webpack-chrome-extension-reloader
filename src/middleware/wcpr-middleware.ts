/* -------------------------------------------------- */
/*  Start of Webpack Chrome Hot Extension Middleware  */
/* ================================================== */
/*  This will be converted into a lodash templ., any  */
/*  external argument must be provided using it       */
/* -------------------------------------------------- */
(function (chrome, window) {
    const signals: any = JSON.parse('<%= signals %>');
    const reloadPage: boolean = <'true' | 'false'>'<%= reloadPage %>' === "true";
    const {SIGN_CHANGE, SIGN_RELOAD, SIGN_RELOADED, SIGN_LOG, SIGN_CONNECT} = signals;

    const {runtime, tabs} = chrome;
    const manifest = runtime.getManifest();

    function contentScriptWorker() {
        runtime.sendMessage({type: SIGN_CONNECT}, msg => console.info(msg));

        runtime.onMessage.addListener(({type, payload}: Action) => {
            switch (type) {
                case SIGN_RELOAD:
                    console.info('[ Detected Changes. Reloading ... ]');
                    reloadPage && window.location.reload();
                    break;

                case SIGN_LOG:
                    console.info(payload);
                    break;
            }
        });
    }

    function backgroundWorker() {
        const socket: WebSocket = new WebSocket('<%= WSHost %>');

        runtime.onMessage.addListener((action: Action, sender, sendResponse) => {
            if (action.type === SIGN_CONNECT) {
                sendResponse('[ Connected to Chrome Extension Hot Reloader ]');
            }
        });

        socket.addEventListener('message', ({data}) => {
            const {type, payload} = JSON.parse(data);

            if (type === SIGN_CHANGE) {
                tabs.query({status: "complete"}, loadedTabs => {
                    loadedTabs.forEach(tab => tabs.sendMessage(tab.id, {type: SIGN_RELOAD}));
                    socket.send(JSON.stringify({
                        type: SIGN_RELOADED,
                        payload: `[${new Date().toDateString()}] ${manifest.name} successfully reloaded`
                    }));
                    runtime.reload();
                });
            }
            else {
                runtime.sendMessage({type, payload});
            }
        });
    }

    runtime.reload ? backgroundWorker() : contentScriptWorker();
})(chrome, window);
/* ----------------------------------------------- */
/* End of Webpack Chrome Hot Extension Middleware  */
/* ----------------------------------------------- */
