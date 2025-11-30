
jQuery(document).ready(function()
{
	var initObj		= new initEnv();
	
	initObj.init();
});

var initEnv			= function()
{ 
	var main		= this;

	main.drawObj 	= null;

	this.init		= function()
	{
		main.init3D();
		main.initPage();
		main.initSlider();
		main.initSkills();
		main.initViewOnline();
	};

	this.initPage = function()
	{
		var params 	= new URLSearchParams(window.location.search);
		var page 	= params.get("page");
		var categ 	= params.get("section");
		var id 		= params.get("id");

		if(page)
		{
			if(main.obj3D)
				main.obj3D.main_group.visible = false;

			$("#area_portfolio").css("display", "block");

			if(page == "portfolio")
			{
				main.initPortfolios(categ, "category");
			}
			else if(page == "filter")
			{
				main.initPortfolios(id, "filter");
			}

			var width = $("#port_body").width();
			var height = (width / 2 - 20) * 0.5;

			$("#port_body dd img").each(function()
			{
				$(this).css("height", height + "px");
			});
		}

		if(categ)
		{
			$("#port_title li").each(function()
			{
				if($(this).attr("area") == categ)
				{
					$(this).attr("class", "active");
				}
				else
				{
					$(this).attr("class", "");
				}
			})
		}
	}

	this.initPortfolios = function(value, mode)
	{
		var html = "";

		main.obj3D.isPortfMode = 1;

		$("#about_me").css('display', "none");
		$("#skill_area").css('display', "none");

		$("#menu_area li:first-child").removeClass("active");
		$("#menu_area li:last-child").addClass("active");

		for(var i = 0; i < portfList.length; i ++)
		{
			if(mode == "filter")
			{
				if(portfList[i].id == value)
				{
					html += '<dd port-id="' + portfList[i].id + '" area="' + portfList[i].area + '">';
					html += '<div class="corner-ribbon"><p>Created By</p><span>' + main.obj3D.userName + '</span></div>';
					html += '<img src="photos/' + portfList[i].thumb + '">';
					html += '<div class="port_label">';
					html += '<p>' + portfList[i].title + '</p>';
					html += '<div class="button" mode="' + portfList[i].mode + '" target="' + portfList[i].url + '"></div>';
					html += '</div></dd>';
				}
			}
			else
			{
				var s_cate = portfList[i].area.split(",");

				if(s_cate.includes(value))
				{
					html += '<dd port-id="' + portfList[i].id + '" area="' + portfList[i].area + '">';
					html += '<div class="corner-ribbon"><p>Created By</p><span>' + main.obj3D.userName + '</span></div>';
					html += '<img src="photos/' + portfList[i].thumb + '">';
					html += '<div class="port_label">';
					html += '<p>' + portfList[i].title + '</p>';
					html += '<div class="button" mode="' + portfList[i].mode + '" target="' + portfList[i].url + '"></div>';
					html += '</div></dd>';
				}
			}
		}

		$("#port_body dl").html(html);
	}

	this.initSlider = function()
	{
		var slider 	= document.getElementById("mySlider");
		var width  	= $("#port_body").width();
		var height 	= (width / 2 - 20) * 0.5;
		var count  	= $("#port_body dd").length;
		var max 	= Math.ceil((Math.ceil(count / 2) * (height + 70) - $("#port_body").height()) / 30);

		slider.value = max;
		slider.max 	 = max;

		slider.addEventListener("input", (e) => 
		{
			document.getElementById("port_body").scrollTop = (max - e.target.value) * 30;
		});

		document.getElementById("port_body").addEventListener("wheel", (event) => 
		{
			event.preventDefault(); // Prevent default scroll

			if (event.deltaY < 0) 
			{
				if(slider.value >= max)
					return;

				slider.value ++;
			} 
			else 
			{
				if(slider.value <= 0)
					return;

				slider.value --;
			}
			
			document.getElementById("port_body").scrollTop = (max - slider.value) * 30;
		}, { passive: false });
	}

	this.initSkills 	= function()
	{
		var num_skills = $("#skill_area span").length;

		$("#skill_area span").each(function()
		{
			var x = Math.random() * 200;
			var y = Math.random() * 150 + 30;

			$(this).css(
			{
				left : x + "px",
				top : y + "px"
			})
		});

		for(var i = 0; i < num_skills; i ++)
		{
			var x = Math.random() * 200;
			var y = Math.random() * 200;
		}

		main.obj3D.isAnimSkill = 1;
	}

	this.initViewOnline = function()
	{
		$("#btn_close_view").on("click", function()
		{
			$("#preview_online").fadeOut();
			$("#preview_online iframe").attr("src", "");
			$("#preview_online iframe").removeAttr("src");
		});

		$(".button").on("click", function()
		{
			var target 	= $(this).attr("target");
			var mode   	= $(this).attr("mode");
			var title 	= $(this).parent().children("p").html();

			if(mode == "visit")
				window.open(target, "_blank");
			else
			{
				$("#preview_online p").html(title);
				$("#preview_online iframe").attr("src", target);
				$("#preview_online").fadeIn();
				$("#loading_page").css('display', "block");

				$("#preview_online iframe").on("load", function () 
				{
					$("#loading_page").css('display', "none");
				});
			}
		})
	}

	this.init3D	= function()
	{
		main.obj3D = new class3D();
	}
}
