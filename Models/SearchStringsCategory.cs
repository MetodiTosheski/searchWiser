//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace FrontwiseRecruitingApp.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class SearchStringsCategory
    {
        public int ID { get; set; }
        public string SearchString { get; set; }
        public string CategoryID { get; set; }
        public string SearchStringGroupID { get; set; }
        public Nullable<bool> Available { get; set; }
        public string PostedBy { get; set; }
    }
}
