using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontwiseRecruitingApp.Models;

namespace FrontwiseRecruitingApp.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "SearchWiser | Home";
            return View();
        }

        public ActionResult login()
        {
            ViewBag.Title = "SearchWiser | Log In";
            return View();
        }

        public ActionResult profile()
        {
            ViewBag.Title = "SearchWiser | Profile";
            return View();
        }

        public ActionResult admin()
        {
            ViewBag.Title = "SearchWiser | Admin";
            return View();
        }
    }
}
