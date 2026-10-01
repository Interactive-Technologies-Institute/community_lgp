// Se um chunk de JS/CSS de uma rota falhar a carregar (rede instável, bloqueador, etc.),
// a navegação SPA fica presa a meio sem estilos. Um reload completo troca isso por um
// carregamento normal da página, onde o CSS volta a ser render-blocking.
//
// Guarda em sessionStorage para não entrar num ciclo de reloads caso o bloqueio seja
// persistente (ex. uma extensão a bloquear sempre o mesmo pedido) — nesse caso só
// tentamos uma vez por sessão e deixamos a página falhada em vez de recarregar sem fim.
const RELOAD_FLAG = 'preload-error-reload';

export function init() {
	window.addEventListener(
		'vite:preloadError',
		() => {
			try {
				if (sessionStorage.getItem(RELOAD_FLAG)) return;
				sessionStorage.setItem(RELOAD_FLAG, '1');
			} catch {
				// Armazenamento bloqueado (ex. navegação privada) — sem forma de registar
				// a tentativa, mas o listener só dispara uma vez por carregamento de página.
			}
			window.location.reload();
		},
		{ once: true },
	);
}
