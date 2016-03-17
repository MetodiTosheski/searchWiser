using FrontwiseRecruitingApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


namespace FrontwiseRecruitingApp.Controllers.api
{
    public class CategoryController : ApiController
    {

        private RecruitingRepository repo = new RecruitingRepository();

        [Route("api/categories")]
        [HttpGet]
        public List<Category> GetCategories()
        {
            var listCategories = repo.GetAllCategories();
            return listCategories;
        }

        [Route("api/dataWords")]
        [HttpGet]
        public List<WordsDto> GetAllWords()
        {
            var listWords = repo.GetAllWords();
            return listWords;
        }

        [Route("api/dataSearchStrings")]
        [HttpGet]
        public List<SearchStringsDto> GetAllSearchStrings()
        {
            var listSearchStrings = repo.GetAllSearchStrings();
            return listSearchStrings;
        }

        [Route("api/editorWords")]
        [HttpGet]
        public List<WordsDto> EditorWords()
        {
            var listWords = repo.GetEditorWords();
            return listWords;
        }

        [Route("api/editorSearchStrings")]
        [HttpGet]
        public List<SearchStringsDto> EditorSearchStrings()
        {
            var listSearchStrings = repo.GetEditorSearchStrings();
            return listSearchStrings;
        }

        [Route("api/categories/GetWords")]
        [HttpGet]
        public  List<WordsDto> GetWords(string category)
        {
            var listWords = repo.GetWordsByCategory(category);

            return listWords;
        }

        [Route("api/categories/GetSimilarWords")]
        [HttpGet]
        public List<WordsDto> GetSimilarWords(string category, string group)
        {
            var listWords = repo.WordsWithCategory(category, group);

            return listWords;
        }

        [Route("api/categories/GetSearchStrings")]
        [HttpGet]
        public List<SearchStringsDto> GetSearchStrings(string category)
        {
            var listWords = repo.GetSearchStringsByCategory(category);

            return listWords;
        }

        [Route("api/categories/GetSimilarSearchStrings")]
        [HttpGet]
        public List<SearchStringsDto> GetSimilarSearchStrings(string category, string group)
        {
            var listSearchStings = repo.GetSimilarStrings(category, group);

            return listSearchStings;
        }

        [Route("api/categories/GetUserSearchStrings")]
        [HttpGet]
        public List<SearchStringsDto> GetUserStrInput(string userid)
        {
            var listSearchStings= repo.GetUserSearchStrings(userid);

            return listSearchStings.ToList();
        }

        [Route("api/categories/GetUserWords")]
        [HttpGet]
        public List<WordsDto> GetUserWordInput(string userid)
        {
            var listWords = repo.GetUserWords(userid);

            return listWords.ToList();
        }

        [Route("api/AddWord")]
        [HttpPost]
        public string AdddWord(WordsCategory word)
        {
            repo.AddWord(word);
            return "OK";
        }

        [Route("api/getUsers")]
        [HttpGet]
        public List<UserDto> getUser(string email)
        {
            var user = repo.GetUser(email);
            return user;
        }

        [Route("api/getAllUsers")]
        [HttpGet]
        public List<UserDto> getAllUsers()
        {
            var users = repo.GetUsers();
            return users;
        }

        [Route("api/AddSearchString")]
        [HttpPost]
        public string AddsString(SearchStringsCategory searchString)
        {
            repo.AddSearchString(searchString);
            return "OK";
        }

        [Route("api/addUser")]
        [HttpPost]
        public string AddUser(User user)
        {
            repo.UpdateUser(user);
            return "Ok";
        }

        [Route("api/removeUser")]
        [HttpPost]
        public string RemoveUser(User user)
        {
            repo.RemoveUser(user);
            return "Ok";
        }

        [Route("api/login")]
        [HttpPost]
        public string loginUser(User data)
        {
            return repo.LoginUser(data.email, data.user_password);
        }

        [Route("api/removeWord")]
        [HttpPost]
        public string RemoveWord(WordsCategory word)
        {
            repo.RemoveWord(word);
            return "Ok";
        }
        [Route("api/removeSeachString")]
        [HttpPost]
        public string RemoveSearchString(SearchStringsCategory searchString)
        {
            repo.RemoveSearchString(searchString);
            return "Ok";
        }

    }
}