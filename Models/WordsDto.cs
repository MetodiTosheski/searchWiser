using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontwiseRecruitingApp.Models
{
    public class WordsDto
    {
        public int ID { get; set; }
        public string Word { get; set; }
        public string CategoryID { get; set; }
        public string WordsGroup { get; set; }
        public string PostedBy { get; set; }
        public Nullable<bool> Available { get; set; }
    }
}