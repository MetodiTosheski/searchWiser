using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontwiseRecruitingApp.Models
{
    public class SearchStringsDto
    {
        public int ID { get; set; }
        public string SearchString { get; set; }
        public string CategoryID { get; set; }
        public string SearchStringGroupID { get; set; }
        public string PostedBy { get; set; }
        public Nullable<bool> Available { get; set; }
    }
}