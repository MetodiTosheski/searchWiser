using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontwiseRecruitingApp.Models
{
    public class UserDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Role { get; set; }
        public string Position { get; set; }
        public string email { get; set; }
        public string user_password { get; set; }
        public int ID { get; set; }
        public Nullable<int> Points { get; set; }
    }
}