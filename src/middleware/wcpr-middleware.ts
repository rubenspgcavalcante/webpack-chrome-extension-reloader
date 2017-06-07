/* -------------------------------------------------- */
/*  Start of Webpack Chrome Hot Extension Middleware  */
/* ================================================== */
/*  This will be converted into a lodash templ., any  */
/*  external argument must be provided using it       */
/* -------------------------------------------------- */
const signals: any = JSON.parse('<%= signals %>');
const reloadPage: boolean = <'true' | 'false'>'<%= reloadPage %>' === "true";
const {SIGN_CHANGE, SIGN_RELOAD, SIGN_RELOADED} = signals;

const {runtime} = chrome;
const manifest = runtime.getManifest();

function contentScriptWorker() {
    const socket: WebSocket = new WebSocket('<%= WSHost %>');

    socket.addEventListener('message', ({data}) => {
        const {type, payload} = JSON.parse(data);

        if (type === SIGN_CHANGE) {
            console.info('[ Detected Changes. Reloading .... ]');

            runtime.sendMessage({type: SIGN_RELOAD}, function () {
                socket.send(JSON.stringify({type: SIGN_RELOADED, payload: `${manifest.name} successfully reloaded`}));
                reloadPage && window.location.reload();
            });
        }
        else {
            console.info(payload);
        }
    });
}

function backgroundWorker() {
    runtime.onMessage.addListener(function () {
        runtime.reload();
    });
}

runtime.reload ? backgroundWorker() : contentScriptWorker();
/* ----------------------------------------------- */
/* End of Webpack Chrome Hot Extension Middleware  */
/* ----------------------------------------------- */
