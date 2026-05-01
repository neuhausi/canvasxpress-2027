$(document).ready(function () {

  //if ($('.typed-npm').length) {
  //  new Typed('.typed-npm', {
  //    strings: ['npm install canvasxpress'],
  //    typeSpeed: 80
  //  })
  //}

  // Setup anchor link scrolling
  //new SmoothScroll('a[href*="#"].smooth-scroll', {
  //  offset: 100,
  //});

  // SVG Injector

  // SVGInjector($('.inject-me'));

  // Setup AOS
  AOS.init({
    once: true,
  });

  // setup loading animation
  window.addEventListener("load", function () {
    document.querySelector('body').classList.add('loaded');
  });

  /**
   * Back to top button
   */
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  });

  // scroll body to 0px on click
  $('#back-to-top').click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 400);
    return false;
  });

  // Buttons on the broadcast page
  $('#broadcast-highlight').click(function () {
    var cxs = CanvasXpress.instances;
    for (var i = 0; i < cxs.length; i++) {
      cxs[i].selectionMode = 'highlight';
    }
    cxs[0].broadcastDraw();
  });
  $('#broadcast-ghost').click(function () {
    var cxs = CanvasXpress.instances;
    for (var i = 0; i < cxs.length; i++) {
      cxs[i].selectionMode = 'ghost';
    }
    cxs[0].broadcastDraw();
  });
  // Buttons on the broadcast page
  $('#broadcast-name').click(function () {
    var cxs = CanvasXpress.instances;
    for (var i = 0; i < cxs.length; i++) {
      cxs[i].selectionMode = 'name';
    }
    cxs[0].broadcastDraw();
  });
  // Buttons on the broadcast page
  $('#broadcast-filter').click(function () {
    var cxs = CanvasXpress.instances;
    for (var i = 0; i < cxs.length; i++) {
      cxs[i].selectionMode = 'filter';
    }
    cxs[0].broadcastDraw();
  });

  /**
   * Button in page
   */
  $('body').on('click', '.btn-code', function (e) {
    var cX = CanvasXpress.$(this.attributes.cxid.value) || CanvasXpress.instances[0];
    if (cX) {
      switch (this.attributes.cxcode.value) {
        case 'js':
          cX.clickShowCode(e);
          break;
        case 'fiddle':
          cX.editJSFiddle(e, true);
          break;
        case 'codepen':
          cX.editCodePen(e, true);
          break;
        case 'r':
          cX.clickShowRCode(e);
          break;
        case 'python':
          cX.clickShowPythonCode(e);
          break;
        case 'jupyter':
          cX.clickShowPythonCode(e, false, true);
          break;
        case 'english':
          cX.clickShowEnglishCode(e);
          break;
        case 'data':
          cX.showView(e);
          break;
        case 'explore':
          cX.showExplorer(e);
          break;
        case 'customize':
          cX.showCustomizer(e);
          break;
        case 'print':
          cX.print(e);
          break;
        case 'chat':
          cX.toggleChatInterface(e);
          break;
        case 'maximize':
          cX.toggleFullScreen(e);
          break;
      }
    }
  });

  /**
   * Theme
   */
  $('body').on('click', '.btn-theme', function (e) {
    for (var i = 0; i < CanvasXpress.instances.length; i++) {
      var cX = CanvasXpress.instances[i];
      cX.changeTheme(this.attributes.cxtheme.value);
    }
  });

  /**
   * Font
   */
  $('body').on('click', '.btn-font', function (e) {
    for (var i = 0; i < CanvasXpress.instances.length; i++) {
      var cX = CanvasXpress.instances[i];
      cX.changeAttribute('fontName', this.attributes.cxfont.value);
    }
  });

  /**
   * Style
   */
  $('body').on('click', '.btn-param', function (e) {
    for (var i = 0; i < CanvasXpress.instances.length; i++) {
      var cX = CanvasXpress.instances[i];
      var ob = JSON.parse(this.attributes.cxfunc.value);
      for (var j = 0; j < ob.length; j++) {
        var fn = ob[j][0];
        var pr = ob[j][1];
        cX[fn].apply(cX, pr);
      }
    }
  });

  /**
   * API
   */
  $('body').on('click', '.btn-api', function (e) {
    var p = this.attributes.cxapi.value;
    $('#' + p + '-cX-API-Row')[0].style.display = 'block';
    var cXi = CanvasXpress.instances;
    if (cXi.length) {
      var ex = cXi[0].getExamplesDocObject(p);
      var id = ex[0][0];
      var cXii = cXi[0].$(id);
      if (cXii) {
        return;
      }
    }
    var cX = new CanvasXpress({
      renderTo: (p + "-cX-API-Hidden"),
      hidden: true
    });
    cX.stopEvent(e);
    cX.cancelEvent(e);
    cX.clickExamplePropertyDescription(e, p, true);
  });

  $('body').on('click', '.btn-close-api', function (e) {
    var p = this.attributes.cxapi.value;
    $('#' + p + '-cX-API-Row')[0].style.display = 'none';
  });

  /**
   * Other graphs
   */
  $('body').on('click', '.ajax-link', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#centerPanel").html('<div class="loader d-flex flex-column"><img src="/assets/images/logo-square.svg" style="width: 30%;margin: auto;" class="pulse" alt=""></div>');
    var url = CanvasXpress.factory.services;
    var data = {
      service: 'retrieve',
      html: this.attributes.cxhtml.value
    }
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      pageId: this.attributes.cxhtml.value,
      success: function (e) {
        CanvasXpress.destroy();
        $('#centerPanel').html($(e).html() || e);
        var cx = CanvasXpress.instances[0];
        if (cx) {
          var id = cx.target.replace(/(\d+)/, '-$1');
          var el = $('#' + id);
          var tt = el.text().replace('# ', '');
          $('#centerPanelId').attr("href", '#' + id);
          $('#centerPanelId').html(tt);
          PR.prettyPrint();
        }
        $('body,html').animate({
          scrollTop: 0
        }, 400);
      },
      error: function (e) {

      }
    });
  });

  /**
   * Other Logs
   */
  $('body').on('click', '.ajax-link-log', function (e) {
    e.preventDefault();
    e.stopPropagation();
    CanvasXpress.destroy('canvasUsage');
    var p = $('#CanvasXpress-ParentNode-canvasUsage').parent();
    var c = "<canvas id='canvasUsage' class='CanvasXpress' width='900' height='600' data-responsive='true' data-aspectRatio='3:2'></canvas>";
    var n = $("<div class='canvas-site'>" + c + "</div>");
    $('#CanvasXpress-ParentNode-canvasUsage').remove();
    p.append(n);
    new CanvasXpress('canvasUsage', this.attributes.cxhtml.value);
  });

  /**
   * Domain Form
   */
  $("#domain-form").on("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var url = $(this).attr("action");
    var data = $(this).serialize();
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function (e) {
        CanvasXpress.destroy('canvasUsage');
        var p = $('#CanvasXpress-ParentNode-canvasUsage').parent();
        var c = "<canvas id='canvasUsage' class='CanvasXpress' width='900' height='600' data-responsive='true' data-aspectRatio='3:2'></canvas>";
        var n = $("<div class='canvas-site'>" + c + "</div>");
        $('#CanvasXpress-ParentNode-canvasUsage').remove();
        p.append(n);
        new CanvasXpress(e);
      },
      error: function (e) {

      }
    });
    return;
  });

  // Site

  /**
   * Examples Modal
   */
  $('.exampleLink').on('click', function (e) {
    $('#examples').fadeOut('fast');
  });

  /**
   * Contact Form
   */
  $("#contact-form").on("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var url = $(this).attr("action");
    var data = $(this).serialize();
    let secret = this.dataset.sitekey;
    let submitter_btn = $(e.originalEvent.submitter);
    grecaptcha.enterprise.ready(function () {
      grecaptcha.enterprise.execute(submitter_btn.data('sitekey'), {
        action: 'submit'
      }).then(function (token) {
        data += '&secret=' + secret + '&token=' + token;
        $.ajax({
          type: "POST",
          url: url,
          data: data,
          success: function (e) {
            $("#contact-form-error").hide();
            $("#contact-form-success").html(e.message);
            $("#contact-form-success").show();
            setTimeout(function () {
              $("#contact-form").trigger("reset");
              $("#contact-form-success").html('');
              $("#contact-form-success").hide();
            }, 3500)
          },
          error: function (e) {
            $("#contact-form-success").hide();
            $("#contact-form-error").html(e.message);
            $("#contact-form-error").show();
          }
        });
      });
    });
    return;
  });

  /**
   * Account Forms
   */
  $(".site-form").on("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var url = $(this).attr("action");
    var data = $(this).serialize();
    var id = this.id;
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      formId: id,
      dataType: 'json',
      success: function (e) {
        var f = $("#" + this.formId);
        var i = f.attr('id');
        if (e.status == "success") {
          if (i == 'login-form') {
            setCookie("canvasXpressUserId", e.message);
            $('#account').modal('hide');
          } else if (e && e != '') {
            $("#" + i + "-success").html(e.message);
            $("#" + i + "-error").hide();
            $("#" + i + "-success").show();
            if (i == 'register-form') {
              setCookie("canvasXpressUserId", e.data);
            }
            setTimeout(function () {
              $("#" + i).trigger("reset");
              $("#" + i + "-success").hide();
              $('#account').modal('hide');
            }, 3500);
          } else {
            $('#account').modal('hide');
          }
        } else {
          $("#" + i + "-error").html(e.message);
          $("#" + i + "-success").hide();
          $("#" + i + "-error").show();
          setTimeout(function () {
            $("#" + i).trigger("reset");
            $("#" + i + "-error").hide();
            $('#account').modal('hide');
          }, 3500);
        }
      },
      error: function (e) {
        var f = $("#" + this.formId);
        var i = f.attr('id');
        $("#" + i + "-error").html("Ooops! Something went wrong!");
        $("#" + i + "-success").hide();
        $("#" + i + "-error").show();
        setTimeout(function () {
          $("#" + i).trigger("reset");
          $("#" + i + "-error").hide();
          $('#account').modal('hide');
        }, 3500);
      }
    });
  });

  /**
   * User Log
   *
   * @returns void
   */
  var userLog = function () {
    var userId = getCookie("canvasXpressUserId");
    var ul = $('#usersLog');
    if (ul.length && userId) {
      userId = '&session=' + (userId.split('::')[2] || '');
      $.ajax({
        type: "POST",
        url: ul.attr('data-action'),
        data: ul.attr('data-service') + userId,
        dataType: 'json',
        success: function (e) {
          if (e.status == "success") {
            new CanvasXpress({
              renderTo: 'canvasXpressUsers',
              data: e.message,
              config: {
                graphType: 'Bar',
                view: 'table',
                colWidth: 180,
                dataTableColProperties: {
                  Date: 200,
                  Email: 350
                }
              }
            });
          } else {
            $('#canvasXpressUsers').fadeOut('fast');
            $('#canvasXpressUsers-error').html(e.message);
            $('#canvasXpressUsers-error').fadeIn('fast');
          }
        },
        error: function (e) {
          $('#canvasXpressUsers').fadeOut('fast');
          $('#canvasXpressUsers-error').html(e.message);
          $('#canvasXpressUsers-error').fadeIn('fast');
        }
      });
    } else {
      $('#canvasXpressUsers').fadeOut('fast');
      $('#canvasXpressUsers-error').html('Login to view logs');
      $('#canvasXpressUsers-error').fadeIn('fast');
      setTimeout(function () {
        $('#canvasXpressUsers-error').html('');
        $('#canvasXpressUsers-error').fadeOut('fast');
        $('#canvasXpressUsers').fadeIn('fast');
      }, 3500);
    }
  }

  /**
   * Check Status
   *
   * @returns void
   */
  var checkStatus = function () {
    var st = $('#llmStatus');
    if (st.length) {
      $.ajax({
        type: "POST",
        url: st.attr('data-action'),
        data: st.attr('data-service'),
        dataType: 'json',
        success: function (e) {
          if (e.status == "success") {
            var p = e.prod;
            var d = e.dev;
            if (p == 1) {
              $('#llmStatusProd').removeClass('bg-secondary').addClass('bg-success');
            } else {
              $('#llmStatusProd').removeClass('bg-secondary').addClass('bg-danger');
            }
            if (d == 1) {
              $('#llmStatusDev').removeClass('bg-secondary').addClass('bg-success');
            } else {
              $('#llmStatusDev').removeClass('bg-secondary').addClass('bg-danger');
            }
          }
        },
        error: function (e) {

        }
      });
    }
  }
  /**
   * LLM Log
   *
   * @returns void
   */
  var llmLog = function () {
    var userId = getCookie("canvasXpressUserId");
    var ll = $('#llmLog');
    if (ll.length && userId) {
      userId = '&session=' + (userId.split('::')[2] || '');
      $.ajax({
        type: "POST",
        url: ll.attr('data-action'),
        data: ll.attr('data-service') + userId,
        dataType: 'json',
        success: function (e) {
          if (e.status == "success") {
            new CanvasXpress({
              renderTo: 'canvasXpressLLMs',
              data: e.message,
              config: {
                graphType: 'Bar',
                view: 'table'
              }
            });
          } else {
            $('#canvasXpressLLMs').fadeOut('fast');
            $('#canvasXpressLLMs-error').html(e.message);
            $('#canvasXpressLLMs-error').fadeIn('fast');
          }
        },
        error: function (e) {
          $('#canvasXpressLLMs').fadeOut('fast');
          $('#canvasXpressLLMs-error').html(e.message);
          $('#canvasXpressLLMs-error').fadeIn('fast');
        }
      });
    } else {
      $('#canvasXpressLLMs').fadeOut('fast');
      $('#canvasXpressLLMs-error').html('Login to view logs');
      $('#canvasXpressLLMs-error').fadeIn('fast');
      setTimeout(function () {
        $('#canvasXpressLLMs-error').html('');
        $('#canvasXpressLLMs-error').fadeOut('fast');
        $('#canvasXpressLLMs').fadeIn('fast');
      }, 3500);
    }
  }

  /**
   * Load the available logs
   *
   * @returns void
   */
  var loadLogs = function () {
    var userId = getCookie("canvasXpressUserId");
    var ul = $('#usageLogs');
    if (ul.length && userId) {
      userId = '&session=' + (userId.split('::')[2] || '');
      $.ajax({
        type: "POST",
        url: ul.attr('data-action'),
        data: ul.attr('data-service') + userId,
        dataType: 'json',
        success: function (e) {
          if (e.status == "success") {
            var u = $('#usageLogs');
            var l = $('#logs');
            var s = u.attr('data-action').replace('/cgi-bin/services.pl', '');
            if (e.data) {
              u.empty();
              l.empty();
              var k = Object.keys(e.data).sort(function (a, b) {
                return e.data[b].order - e.data[a].order;
              });
              var z = e.data[k[0]].name.replace(/^\.\./, s) + '.json';
              u.append('<a href="#" class="d-block ajax-link-log" role="button" cxhtml="' + z + '">' + k[0] + '</a>');
              for (var i = 0; i < k.length; i++) {
                if (i < 100) {
                  var w = e.data[k[i]].name.replace(/^\.\./, s) + '.json';
                  l.append('<a href="#" class="d-block ajax-link-log" role="button" cxhtml="' + w + '">' + k[i] + '</a>');
                }
              }
              new CanvasXpress('canvasUsage', z);
            }
          } else {
            $('#canvasUsage').fadeOut('fast');
            $('#canvasUsage-error').html(e.message);
            $('#canvasUsage-error').fadeIn('fast');
          }
        },
        error: function (e) {
          $('#canvasUsage').fadeOut('fast');
          $('#canvasUsage-error').html(e.message);
          $('#canvasUsage-error').fadeIn('fast');
        }
      });
    } else {
      $('#canvasUsage').fadeOut('fast');
      $('#canvasUsage-error').html('Login to view logs');
      $('#canvasUsage-error').fadeIn('fast');
      setTimeout(function () {
        $('#canvasUsage-error').html('');
        $('#canvasUsage-error').fadeOut('fast');
        $('#canvasUsage').fadeIn('fast');
      }, 3500);
    }
  }

  /**
   * Show Register Form
   *
   * @returns void
   */
  $('#showRegisterForm').on('click', function () {
    $('#login').fadeOut('fast', function () {
      $('#forgot').fadeOut('fast');
      $('#register').fadeIn('fast');
      $('#forgot-footer').fadeOut('fast', function () {
        $('#login-footer').fadeIn('fast');
      });
    });
    $('.modal-title').html('Register with');
    $('.error').removeClass('alert alert-danger').html('');
  });

  /**
   * Show Login Form
   *
   * @returns void
   */
  $('#showLoginForm').on('click', function () {
    unsetCookie("canvasXpressUserId");
    $('#register').fadeOut('fast', function () {
      $('#logout').fadeOut('fast');
      $('#forgot').fadeOut('fast');
      $('#login').fadeIn('fast');
      $('#login-footer').fadeOut('fast', function () {
        $('#create-footer').fadeIn('fast');
      });
    });
    $('.modal-title').html('Login with');
    $('.error').removeClass('alert alert-danger').html('');
  });

  /**
   * Show Forgot Form
   *
   * @returns void
   */
  $('#showForgotForm').on('click', function () {
    $('#login').fadeOut('fast', function () {
      $('#register').fadeOut('fast');
      $('#forgot').fadeIn('fast');
      $('#create-footer').fadeOut('fast', function () {
        $('#login-footer').fadeIn('fast');
      });
    });
    $('.modal-title').html('Enter email');
    $('.error').removeClass('alert alert-danger').html('');
  });

  /**
   * Logout Form
   *
   * @returns void
   */
  $('#logoutForm').on('click', function () {
    unsetCookie("canvasXpressUserId");
    $('#account').modal('hide');
  });

  /**
   * Set Cookie
   *
   * @returns void
   */
  var setCookie = function (cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    checkCookie(cname);
  }

  /**
   * Unset Cookie
   *
   * @returns void
   */
  var unsetCookie = function (cname) {
    var d = new Date();
    d.setTime(d.getTime() + 1);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=;" + expires + ";path=/";
    checkCookie(cname);
  }

  /**
   * Get Cookie
   *
   * @returns void
   */
  var getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  /**
   * Check Cookie
   *
   * @returns void
   */
  var checkCookie = function (cname) {
    var val = getCookie(cname);
    var nav = "";
    if (val != "") {
      nav = val.split('::')[0].substring(0, 2);
      $("#siteUserId").text(nav);
      $('#toggleLogout').text(nav);
      $('#toggleLogin').css('display', 'none');
      $('#toggleLogout').css('display', 'flex');
      $('#toggleLogin').removeAttr("data-toggle");
      $('#loginModalLabel').text('Logout');
      $('#login').css('display', 'none');
      $('#logout').css('display', 'block');
      $('.modal-ftr').css('display', 'none');
    } else {
      nav = "&nbsp;";
      $("#siteUserId").text(nav);
      $('#toggleLogout').text(nav);
      $('#toggleLogin').fadeIn('fast');
      $('#toggleLogout').css('display', 'none');
      $('#toggleLogin').css('display', 'flex');
      $('#toggleLogin').attr("data-toggle", "modal");
      $('#loginModalLabel').text('Login');
      $('#login').css('display', 'block');
      $('#logout').css('display', 'none');
      $('.modal-ftr').css('display', 'block');
    }
  }

  checkCookie("canvasXpressUserId");
  loadLogs();
  userLog();
  llmLog();
  checkStatus();

  /** Custom JavaScript for interactive sidebar and content toggling and new AI visualization feature **/

  // Select all sidebar navigation links
  const navLinks = document.querySelectorAll('.nav-aside');
  // Select all content sections that we want to track for active state
  const contentSections = document.querySelectorAll('.container');

  let currentActiveLink = null;

  // Function to handle updating the active link on scroll
  const updateActiveLink = () => {
    // Get the current scroll position from the top of the window
    const scrollPosition = window.scrollY;
    // Loop through each content section to determine which is in view
    contentSections.forEach(section => {
      const sectionTop = section.offsetTop;
      // Check if the current scroll position is past the top of the section
      // with a small offset for better user experience.
      if (scrollPosition >= sectionTop - 100) {
        currentActiveLink = section.getAttribute('id');
      }
    });

    // Remove the 'active-nav' class and add 'inactive-nav' to all links
    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      link.classList.add('inactive-nav');
      // If a link's href matches the ID of the current section, make it active
      if (link.getAttribute('href').substring(1) === currentActiveLink) {
        link.classList.remove('inactive-nav');
        link.classList.add('active-nav');
      }
    });
  };

  // Add a scroll event listener to the window
  window.addEventListener('scroll', updateActiveLink);

  // Call the function on initial load to set the correct active link
  updateActiveLink();

  // Handle smooth scrolling when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      // Prevent the default anchor link behavior
      e.preventDefault();
      // Get the target section's ID from the href
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        // Use scrollIntoView with smooth behavior
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // New AI visualization generation logic
  const generateChartBtn = document.getElementById('generate-chart-btn');
  const promptInput = document.getElementById('prompt-input');
  const chartContainer = document.getElementById('generated-chart');
  const loadingIndicator = document.getElementById('loading-indicator');
  const chartPlaceholder = document.getElementById('chart-placeholder');

  const explainParamBtn = document.getElementById('explain-param-btn');
  const paramSelect = document.getElementById('param-select');
  const paramExplanation = document.getElementById('param-explanation');
  const loadingIndicatorParam = document.getElementById('loading-indicator-param');

  if (generateChartBtn) {
    generateChartBtn.addEventListener('click', async () => {
      const prompt = promptInput.value;
      if (!prompt) {
        // Using a custom modal/message box instead of alert()
        // Since this is a simple example, we'll just modify the UI
        chartContainer.innerHTML = `<div class="alert alert-warning" role="alert">
                            Please enter a prompt to generate a visualization.
                        </div>`;
        chartPlaceholder.style.display = 'block';
        return;
      }

      // Show loading indicator and clear previous chart
      loadingIndicator.style.display = 'block';
      chartPlaceholder.style.display = 'none';
      chartContainer.innerHTML = ''; // Clear previous chart

      try {
        let retryCount = 0;
        const maxRetries = 3;
        const initialDelay = 1000; // 1 second

        while (retryCount < maxRetries) {
          try {
            // Construct the payload for the Gemini API call
            const chatHistory = [{
              role: "user",
              parts: [{
                text: `As a data visualization expert, generate a CanvasXpress visualization based on the following request: "${prompt}". The response must be a JSON object containing 'data' and 'options' properties, which are the standard CanvasXpress parameters. Do not include any other text or markdown outside the JSON object. Just the JSON object itself. Make sure to generate the data as well. Always use the canvasXpress.init('id', options, data) format for the chart. Example of response: { "data": { "y": { "vars": ["var1"], "smps": ["smp1"], "data": [[1]] } }, "options": { "graphType": "Bar" } }`
              }]
            }];
            const payload = {
              contents: chatHistory,
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                  "type": "OBJECT",
                  "properties": {
                    "data": {
                      "type": "OBJECT"
                    },
                    "options": {
                      "type": "OBJECT"
                    }
                  }
                }
              }
            };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            if (!response.ok) {
              throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const json = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (json) {
              const parsedJson = JSON.parse(json);

              // Check for the new canvasXpress.init() format
              if (parsedJson.data && parsedJson.options) {
                // Use the parsed JSON to create the chart
                new CanvasXpress(
                  "generated-chart",
                  parsedJson.data,
                  parsedJson.options
                );
              } else {
                throw new Error('Invalid JSON format received from API.');
              }
              break; // Exit retry loop on success
            } else {
              throw new Error('No content in API response.');
            }
          } catch (error) {
            console.error(`Error fetching from API (Attempt ${retryCount + 1}):`, error);
            if (retryCount < maxRetries - 1) {
              const delay = initialDelay * Math.pow(2, retryCount);
              await new Promise(res => setTimeout(res, delay));
              retryCount++;
            } else {
              throw error; // Re-throw the error after max retries
            }
          }
        }
      } catch (error) {
        console.error('Failed to generate chart:', error);
        chartContainer.innerHTML = `<div class="alert alert-danger" role="alert">
                            <strong>Error:</strong> Failed to generate chart. Please try a different prompt.
                        </div>`;
        chartPlaceholder.style.display = 'block';
      } finally {
        loadingIndicator.style.display = 'none';
      }
    });
  }

  if (explainParamBtn) {
    explainParamBtn.addEventListener('click', async () => {
      const selectedParam = paramSelect.value;
      if (!selectedParam) {
        paramExplanation.innerHTML = `<div class="alert alert-warning" role="alert">
                            Please select a parameter.
                        </div>`;
        return;
      }

      loadingIndicatorParam.style.display = 'block';
      paramExplanation.innerHTML = 'Generating...';

      try {
        let retryCount = 0;
        const maxRetries = 3;
        const initialDelay = 1000;

        while (retryCount < maxRetries) {
          try {
            const chatHistory = [{
              role: "user",
              parts: [{
                text: `Explain the CanvasXpress parameter "${selectedParam}" in a concise and clear manner. Focus on what it does and how a user might use it. Do not include any code examples. Just the explanation.`
              }]
            }];
            const payload = {
              contents: chatHistory
            };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            if (!response.ok) {
              throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const explanation = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (explanation) {
              paramExplanation.innerHTML = explanation;
              break;
            } else {
              throw new Error('No content in API response.');
            }
          } catch (error) {
            console.error(`Error fetching from API (Attempt ${retryCount + 1}):`, error);
            if (retryCount < maxRetries - 1) {
              const delay = initialDelay * Math.pow(2, retryCount);
              await new Promise(res => setTimeout(res, delay));
              retryCount++;
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        console.error('Failed to explain parameter:', error);
        paramExplanation.innerHTML = `<div class="alert alert-danger" role="alert">
                            <strong>Error:</strong> Failed to generate explanation. Please try again.
                        </div>`;
      } finally {
        loadingIndicatorParam.style.display = 'none';
      }
    });
  }



  /** Google Oauth Stuff **/

  // Function to generate a random state value
  var generateCryptoRandomState = function () {
    const randomValues = new Uint32Array(2);
    window.crypto.getRandomValues(randomValues);
    // Encode as UTF-8
    const utf8Encoder = new TextEncoder();
    const utf8Array = utf8Encoder.encode(
      String.fromCharCode.apply(null, randomValues)
    );
    // Base64 encode the UTF-8 data
    return btoa(String.fromCharCode.apply(null, utf8Array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // If there's an access token, try an API request.
  // Otherwise, start OAuth 2.0 flow.
  var trySampleRequest = function () {
    var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
    if (params && params['access_token']) {
      // User authorized the request. Now, check which scopes were granted.
      if (params['scope'].includes('https://www.googleapis.com/auth/drive.metadata.readonly')) {
        // User authorized read-only Drive activity permission.
        // Calling the APIs, etc.
        var xhr = new XMLHttpRequest();
        xhr.open('GET',
          'https://www.googleapis.com/drive/v3/about?fields=user&' +
          'access_token=' + params['access_token']);
        xhr.onreadystatechange = function (e) {
          if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.response);
          } else if (xhr.readyState === 4 && xhr.status === 401) {
            // Token invalid, so prompt for user permission.
            oauth2SignIn();
          }
        };
        xhr.send(null);
      } else {
        // User didn't authorize read-only Drive activity permission.
        // Update UX and application accordingly
        console.log('User did not authorize read-only Drive activity permission.');
      }
      // Check if user authorized Calendar read permission.
      if (params['scope'].includes('https://www.googleapis.com/auth/calendar.readonly')) {
        // User authorized Calendar read permission.
        // Calling the APIs, etc.
        console.log('User authorized Calendar read permission.');
      } else {
        // User didn't authorize Calendar read permission.
        // Update UX and application accordingly
        console.log('User did not authorize Calendar read permission.');
      }
    } else {
      oauth2SignIn();
    }
  }

  /*
   * Create form to request access token from Google's OAuth 2.0 server.
   */
  var oauth2SignIn = function () {
    // create random state value and store in local storage
    var state = generateCryptoRandomState();
    localStorage.setItem('state', state);
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    // Create element to open OAuth 2.0 endpoint in new window.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);
    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
      'client_id': "4892823552-2dvfrujtpbe20brfkukgb4qfsepvjp0f.apps.googleusercontent.com",
      'redirect_uri': "https://canvasxpress.org",
      'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly',
      'state': state,
      'include_granted_scopes': 'true',
      'response_type': 'token'
    };
    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

  // OAuth 2.0
  $('#loginGoogle').on('click', function () {
    trySampleRequest();
  });

});

// Parse query string to see if page request is coming from OAuth 2.0 server.
var fragmentString = location.hash.substring(1);
var params = {};
var regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(fragmentString)) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
if (Object.keys(params).length > 0 && params['state']) {
  if (params['state'] == localStorage.getItem('state')) {
    localStorage.setItem('oauth2-test-params', JSON.stringify(params));
    trySampleRequest();
  } else {
    console.log('State mismatch. Possible CSRF attack');
  }
}

