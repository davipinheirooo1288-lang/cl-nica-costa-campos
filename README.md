# Clínica Costa Campos

Site institucional premium da Clínica Costa Campos, feito em HTML, CSS e JavaScript puros para facilitar manutenção e deploy.

## Estrutura

- `index.html`: conteúdo e seções do site.
- `styles.css`: visual, responsividade, animações e layout.
- `script.js`: interações, formulário inteligente, carrosséis, lightbox e header.
- `assets/originals/`: imagens originais em alta qualidade.
- `assets/optimized/`: imagens leves usadas no carregamento do site.

## Atualizações rápidas

- **Contato, redes sociais e links**: edite os links diretamente no `index.html`.
- **Especialidades do formulário**: edite as opções do `select` com `id="serviceSelect"` no `index.html`.
- **Depoimentos**: edite os cards dentro de `id="reviewTrack"` no `index.html`.
- **Fotos dos médicos**: adicione o PNG original em `assets/originals/`, gere/adicione uma versão leve em `assets/optimized/` e replique o padrão:

```html
<article class="doctor-card">
  <img
    src="assets/optimized/nome-da-imagem.jpg"
    data-full-src="assets/originals/nome-da-imagem.png"
    alt="Profissional da Clínica Costa Campos"
    loading="lazy"
    decoding="async"
  />
</article>
```

## Deploy

Projeto estático pronto para Vercel. Não precisa de build.
