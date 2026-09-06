"use strict";
(function() {
    var cx = "008572255874373046644:chip1p1uf-4";
    var gcse = document.createElement("script");
    gcse.type = "text/javascript";
    gcse.async = true;
    gcse.src = (document.location.protocol == "https:" ? "https:" : "http:") + "//www.google.com/cse/cse.js?cx=" + cx;
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(gcse, s);
})();

function checkBck() {
    jQuery(".gsc-input input").attr("placeholder", "Buscar en la Universidad");
    if (!jQuery(".gsc-search-button input").attr("src")) {
        window.setTimeout(function() {
            checkBck();
        }, 100);
    }
}
checkBck();
jQuery(document).ready(function($) {
    render_banner_components();
    render_main_menu();
    render_accessibility_panel();
    prepare_content_menu();
    $("#unalOpenMenuServicios, #unalOpenMenuPerfiles").on("click", function(e) {
        var $target = $(this).data("target");
        var $mOffset = $(this).offset();
        $($target).css({
            top: $mOffset.top + $(this).outerHeight(),
            left: $mOffset.left
        });
    });

    function serviceMenuStatus() {
        var $s = $("#services");
        $s.height($(window).height());
        $("ul", $s).height($(window).height());
        if ($(".indicator", "#services").hasClass("active")) {
            $s.css({
                right: 0
            });
        } else {
            $s.css({
                right: parseInt($("#services").width()) * -1
            });
        }
    }
    $(".indicator", "#services").click(function() {
        $(this).toggleClass("active");
        serviceMenuStatus();
    });
    $(window).resize(function() {
        $(".open").removeClass("open");
        if ($(window).width() > 767) {
            $("#services").css({
                right: parseInt($("#services").width()) * -1,
                left: "auto",
                top: "auto"
            });
            $("#bs-navbar").removeClass("in");
            serviceMenuStatus();
        } else {
            $(".indicator", "#services").removeClass("active");
        }
    });
    $("#services").css({
        right: parseInt($("#services").width()) * -1
    });
    serviceMenuStatus();
});

function prepare_content_menu(){
    var $content_subdominio = $( "#subdominio" ).html();
    $( "#container_subdominio_mobil" ).html( $content_subdominio );

    var $content_buscador = $( "#buscador" ).html();
    $( "#container_buscador_mobil" ).html( $content_buscador );

    var $content_mainmenu = $('#main_menu_container').clone().find(".menu_sedes").remove().end().html()
    $( "#container_mainmenu_mobil" ).html( $content_mainmenu );

    var $conten_sedes = $( "#sedes" ).html();
    $( "#container_sedes_mobil" ).html( $conten_sedes );

    var $conten_servicios = $( "#services" ).html();
    $( "#container_servicios_mobil" ).html( "<ul>" + $conten_servicios + "</ul>");

    var $conten_profiles = $( "#profiles" ).html();
    $( "#container_profiles_mobil" ).html( $conten_profiles );
}

/**
 * Renders every `[data-component="banner"]` placeholder into the full TLÖN
 * video banner.
 *
 * Attributes read from the placeholder element:
 * - `data-label` — text shown over the video (defaults to "TLÖN").
 * - `data-video` — local video file to autoplay/loop (defaults to the site's
 *   own clip). The banner always shows a local file, never a live embed —
 *   that's what keeps it looking like a silent looping "gif" instead of a
 *   real YouTube player with its play/pause/next chrome.
 * - `data-youtube` — URL the banner links to when clicked ("watch on
 *   YouTube"). Defaults to the site's own video.
 */
function render_banner_components() {
    jQuery("[data-component='banner']").each(function() {
        var $el = jQuery(this);
        var label = $el.data("label") || "TLÖN";
        var videoSrc = $el.data("video") || "public/video/video_recortado.webm";
        var linkUrl = $el.data("youtube") || "https://www.youtube.com/watch?v=203crulPgBc";

        var html = `
    <section
      class="tw-relative tw-z-0 tw-w-screen tw-left-1/2 tw-right-1/2 tw--ml-[50vw] tw--mr-[50vw] tw-flex tw-flex-col tw-items-center tw-h-auto md:tw-h-[665px] tw-mb-8 tw-overflow-hidden">

      <a class="tw-w-full tw-relative tw-block" href="${linkUrl}" target="_blank">
        <video autoplay muted loop playsinline disablepictureinpicture
          class="tw-object-cover tw-object-left tw-w-full tw-h-[208px] md:tw-h-[605px] tw-shadow-lg tw-brightness-75">
          <source src="${videoSrc}" type="video/webm">
          Tu navegador no soporta el elemento video.
        </video>

        <span
          class="tw-absolute tw-bottom-0 tw-left-0 xl:tw-bottom-[12%] xl:tw-left-10 tw-bg-[#424242B3] tw-bg-opacity-20 tw-w-[180px] tw-h-[60px] xl:tw-w-[290px] xl:tw-h-[80px] tw-z-10 tw-text-white tw-flex tw-items-center tw-text-center tw-px-6 xl:tw-rounded-lg tw-text-[10px] xl:tw-text-[15px]">
          ${label}
        </span>

        <img src="public/images/tlon-logo.png" alt="Logo de TLÖN"
          class="tw-absolute tw-top-10 tw-right-10 tw-w-[54px] tw-h-[38px] tw-z-10" />
      </a>

      <div
        class="tw-absolute tw-bottom-0 tw-left-1/2 tw--translate-x-1/2 tw-z-20 tw-bg-[image:linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('/public/images/recorte_banner.png')] tw-bg-center tw-bg-cover tw-bg-no-repeat xl:tw-rounded-xl tw-w-full xl:tw-w-[1260px] tw-justify-center tw-flex tw-py-6">
        <span
          class="tw-flex tw-text-white tw-text-xl xl:tw-text-4xl tw-text-center tw-font-bold tw-w-full xl:tw-w-[1056px] tw-justify-center tw-select-none">
          Grupo de Investigación en Redes de Telecomunicaciones Dinámicas y Lenguajes de Programación Distribuidos
        </span>
      </div>
    </section>
        `;
        $el.replaceWith(html);
    });
}

/**
 * Site-wide nav menu — identical on every page by design, no per-page
 * overrides. Edit here, not in the HTML files, and it updates everywhere.
 */
function render_main_menu() {
    var html = `
        <div class="btn-group ghost_button">
          <div style="width: 0; padding-left: 0; padding-right: 0;" class="btn disabled" data-toggle="" disabled></div>
        </div>
        <ul class="btn-group">
          <li><a href="/" class="btn btn-default">Inicio</a></li>
          <li class="tw-cursor-pointer">
            <div class="btn btn-default dropdown-toggle" data-toggle="dropdown">
              ¿Quiénes somos?<span class="caret"></span>
            </div>
            <ul class="dropdown-menu dropItem-160">
              <li><a href="/filosofia" class="tw-flex">Filosofía</a></li>
              <li><a href="/historia" class="tw-flex">Historia</a></li>
              <li><a href="/directorio" class="tw-flex">Directorio</a></li>
            </ul>
          </li>
          <li class="tw-cursor-pointer">
            <div class="btn btn-default dropdown-toggle" data-toggle="dropdown">
              Proyecto TLÖN<span class="caret"></span>
            </div>
            <ul class="dropdown-menu dropItem-160">
              <li><a href="/concepto" class="tw-flex">Concepto</a></li>
              <li><a href="/campos-investigacion" class="tw-flex">Campos de Investigación</a></li>
              <li><a href="/modelo" class="tw-flex">Modelo Social-Inspirado</a></li>
            </ul>
          </li>
          <li class="tw-cursor-pointer">
            <div class="btn btn-default dropdown-toggle" data-toggle="dropdown">
              Actividades<span class="caret"></span>
            </div>
            <ul class="dropdown-menu dropItem-160">
              <li><a href="/investigacion" class="tw-flex">Investigación</a></li>
              <li><a href="/docencia" class="tw-flex">Docencia</a></li>
              <li><a href="/extension" class="tw-flex">Extensión</a></li>
            </ul>
          </li>
          <li><a href="/produccion-intelectual" class="btn btn-default">Producción Intelectual</a></li>
          <li><a href="/babel" class="btn btn-default">Libros</a></li>
        </ul>

        <!-- Sedes -->
        <div class="btn-group menu_sedes">
          <div class="btn btn-default dropdown-toggle tw-cursor-pointer" data-toggle="dropdown">
            Sedes<span class="caret"></span>
          </div>
          <ul class="dropdown-menu" id="sedes">
            <li><a class="dropdown-item" href="https://amazonia.unal.edu.co" target="_blank">Amazonia</a><span class="caret-right"></span></li>
            <li><a class="dropdown-item" href="https://bogota.unal.edu.co" target="_blank">Bogotá</a><span class="caret-right"></span></li>
            <li><a class="dropdown-item" href="https://caribe.unal.edu.co" target="_blank">Caribe</a><span class="caret-right"></span></li>
            <li><a class="dropdown-item" href="https://delapaz.unal.edu.co" target="_blank">De La Paz</a><span class="caret-right"></span></li>
            <li><a class="dropdown-item" href="https://www.manizales.unal.edu.co" target="_blank">Manizales</a><span class="caret-right"></span></li>
            <li><a class="dropdown-item" href="https://medellin.unal.edu.co" target="_blank">Medellín</a><span class="caret-right"></span></li>
            <li><a class="dropdown-item" href="https://orinoquia.unal.edu.co" target="_blank">Orinoquia</a><span class="caret-right"></span></li>
            <li><a class="dropdown-item" href="https://www.palmira.unal.edu.co" target="_blank">Palmira</a><span class="caret-right"></span></li>
            <li><a class="dropdown-item" href="https://tumaco-pacifico.unal.edu.co" target="_blank">Tumaco</a><span class="caret-right"></span></li>
          </ul>
        </div>
    `;
    jQuery("[data-component='main-menu']").html(html);
}

/**
 * Accessibility panel (font size, contrast, invert colors) — identical on
 * every page. Edit here, not in the HTML files.
 */
function render_accessibility_panel() {
    var panelHtml = `
    <div id="panel-accesibilidad" style="display: none;" class="panel-content container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-3">
              <h4>Tamaño letra</h4>
              <button class="boton-panel" id="letra-disminuir" onclick="cambiarTamanioLetra('-')" type="submit">A<sup>-</sup></button>
              <button class="boton-panel" id="letra-aumentar" onclick="cambiarTamanioLetra('+')" type="submit">A<sup>+</sup></button>
              <input disabled="1" class="letras-porcentaje" id="letter-percent" type="text" value="100%" />
            </div>
            <div class="col-md-3">
              <h4>Cambiar Contrastes</h4>
              <button class="boton-panel" id="contraste-1" onclick="cambiarContrastes(1)" type="submit">1</button>
              <button class="boton-panel" id="contraste-2" onclick="cambiarContrastes(2)" type="submit">2</button>
              <button class="boton-panel" id="contrate-3" onclick="cambiarContrastes(3)" type="submit">3</button>
            </div>
            <div class="col-md-3">
              <h4>Invertir colores</h4>
              <button class="boton-panel" id="inversor" onclick="invertirColores()" type="submit">Aplicar</button>
            </div>
            <div class="col-md-3">
              <h4>Restablecer ajustes</h4>
              <button class="boton-panel" id="defaul-config" onclick="defaultConfig()" type="submit">Aplicar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button id="pestania-accesibilidad" class="tw-block md:tw-hidden" onclick="accesstab()">Panel de Accesibilidad</button>
    `;
    var tabHtml = `
    <button id="pestania-accesibilidad" class="tw-hidden md:tw-block" onclick="accesstab()">Panel de Accesibilidad</button>
    `;
    jQuery("[data-component='accessibility-panel']").html(panelHtml);
    jQuery("[data-component='accessibility-tab']").html(tabHtml);
}
