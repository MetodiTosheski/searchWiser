using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace FrontwiseRecruitingApp.Models
{
    public class RecruitingRepository
    {
        private RecruitingAppContext entity = new RecruitingAppContext();

        public List<Category> GetAllCategories()
        {
            return entity.Categories.ToList();
        }

        public List<WordsDto> GetAllWords()
        {
            var listWords = entity.Words.Select(x => new WordsDto { ID = x.ID, Word = x.Word, CategoryID = x.CategoryID, WordsGroup = x.WordsGroup, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.Available == true);
            return listWords.ToList();
        }

        public List<WordsDto> GetEditorWords()
        {
            var listWords = entity.Words.Select(x => new WordsDto { ID = x.ID, Word = x.Word, CategoryID = x.CategoryID, WordsGroup = x.WordsGroup, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.Available == false);
            return listWords.ToList();
        }

        public List<SearchStringsDto> GetEditorSearchStrings()
        {
            var listSearchStrings = entity.SearchStrings.Select(x => new SearchStringsDto { ID = x.ID, SearchString = x.SearchString, CategoryID = x.CategoryID, SearchStringGroupID = x.SearchStringGroupID, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.Available == false);
            return listSearchStrings.ToList();
        }

        public List<SearchStringsDto> GetAllSearchStrings()
        {
            var listSearchStrings = entity.SearchStrings.Select(x => new SearchStringsDto { ID = x.ID, SearchString = x.SearchString, CategoryID = x.CategoryID, SearchStringGroupID = x.SearchStringGroupID, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.Available == true);
            return listSearchStrings.ToList();
        }
        public List<WordsDto> GetWordsByCategory(string category)
        {
            var listWords = entity.Words.Select(x => new WordsDto { ID = x.ID, Word = x.Word, CategoryID = x.CategoryID, WordsGroup = x.WordsGroup, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.CategoryID == category && x.Available == true);
            return listWords.ToList();
        }

        public List<WordsDto> WordsWithCategory(string category, string group)
        {
            var listWords = entity.Words.Select(x => new WordsDto { ID = x.ID, Word = x.Word, CategoryID = x.CategoryID, WordsGroup = x.WordsGroup, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.CategoryID == category && x.WordsGroup == group);
            return listWords.ToList();
        }

        public List<SearchStringsDto> GetSearchStringsByCategory(string category)
        {
            var listSearchStrings = entity.SearchStrings.Select(x => new SearchStringsDto { ID = x.ID, SearchString = x.SearchString, CategoryID = x.CategoryID, SearchStringGroupID = x.SearchStringGroupID, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.CategoryID == category && x.Available == true);
            return listSearchStrings.ToList();
        }

        public List<SearchStringsDto> GetSimilarStrings(string category, string group)
        {
            var listSearchStrings = entity.SearchStrings.Select(x => new SearchStringsDto { ID = x.ID, SearchString = x.SearchString, CategoryID = x.CategoryID, SearchStringGroupID = x.SearchStringGroupID, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.CategoryID == category && x.SearchStringGroupID == group);
            return listSearchStrings.ToList();
        }

        public List<SearchStringsDto> GetUserSearchStrings(string userid)
        {
            var listSearchStrings = entity.SearchStrings.Select(x => new SearchStringsDto { SearchString = x.SearchString, CategoryID = x.CategoryID, SearchStringGroupID = x.SearchStringGroupID, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.PostedBy == userid && x.Available == true);
            return listSearchStrings.ToList();
        }

        public List<WordsDto> GetUserWords(string userid)
        {
            var listWords = entity.Words.Select(x => new WordsDto {Word = x.Word, CategoryID = x.CategoryID, WordsGroup = x.WordsGroup, Available = x.Available, PostedBy = x.PostedBy }).Where(x => x.PostedBy == userid && x.Available == true);
            return listWords.ToList();
        }

        public List<UserDto> GetUser(string email)
        {
            var user = entity.User.Select(x => new UserDto { ID = x.ID, email = x.email, Name = x.Name, Position = x.Position, Role = x.Role, Surname = x.Surname, user_password = x.user_password, Points = x.Points }).Where(x => x.email == email);

            return user.ToList();
        }

        public List<UserDto> GetUsers()
        {
            var users = entity.User.Select(x => new UserDto { ID = x.ID, email = x.email, Name = x.Name, Position = x.Position, Role = x.Role, Surname = x.Surname, Points = x.Points});
            return users.ToList();
        }

        public int  lastSynonymGroupID()
        {
            var words = entity.Words.OrderByDescending(x => x.WordsGroup).First();
            return Convert.ToInt32(words.WordsGroup);
        }

        public int lastSearchStringGroupID()
        {
            var searchstrings = entity.SearchStrings.OrderByDescending(x => x.SearchStringGroupID).First();
            return Convert.ToInt32(searchstrings.SearchStringGroupID);
        }

        public void AddWord(WordsCategory word)
        {
            var editedWord = entity.Words.Find(word.ID);
            if (editedWord == null)
            {
                if(word.WordsGroup == null)
                {
                    int lastID = lastSynonymGroupID();
                    word.WordsGroup = (lastID + 1).ToString();
                }
                entity.Words.Add(word);
            }
            else {
                addPoints(word.PostedBy);
                editedWord.Word = word.Word;
                editedWord.CategoryID = word.CategoryID;
                editedWord.WordsGroup = word.WordsGroup;
                editedWord.Available = word.Available;
                editedWord.PostedBy = word.PostedBy;
            }
            entity.SaveChanges();
        }

        public void AddSearchString(SearchStringsCategory sString)
        {

            var editedString = entity.SearchStrings.Find(sString.ID);
            if (editedString == null)
            {
                if (sString.SearchStringGroupID == null)
                {
                    int lastID = lastSearchStringGroupID();
                    sString.SearchStringGroupID = (lastID + 1).ToString();
                }
                entity.SearchStrings.Add(sString);
            }
            else {
                addPoints(sString.PostedBy);
                editedString.SearchString = sString.SearchString;
                editedString.CategoryID = sString.CategoryID;
                editedString.SearchStringGroupID = sString.SearchStringGroupID;
                editedString.Available = sString.Available;
                editedString.PostedBy = sString.PostedBy;
            }
            entity.SaveChanges();
        }
        public void UpdateUser(User user)
        {
            var editedUser = entity.User.Find(user.ID);
            if (editedUser == null)
            {
               user.user_password = Encrypt("123456");
               // user.user_password = "123456";
                entity.User.Add(user);
            }
            else {
                editedUser.Name = user.Name;
                editedUser.Surname = user.Surname;
                editedUser.Role = user.Role;
                editedUser.Position = user.Position;
                editedUser.email = user.email;
                if (user.user_password != null) { 
                editedUser.user_password = Encrypt(user.user_password);
                 // editedUser.user_password = user.user_password;
                }
            }
            entity.SaveChanges();
        }

        public void addPoints(string userId)
        {
            int user = Int16.Parse(userId);
            var User = entity.User.Find(user);
            User.Points = User.Points + 2;
            entity.SaveChanges();
        }
    
        public string Encrypt(string plainText)
        {
            if (plainText == null) throw new ArgumentNullException("plainText");

            //encrypt data
            var data = Encoding.Unicode.GetBytes(plainText);
            DataProtectionScope Scope = default(DataProtectionScope);
            byte[] encrypted = ProtectedData.Protect(data, null, Scope);

            //return as base64 string
            return Convert.ToBase64String(encrypted);
        }

       public string Decrypt(string cipher)
        {
            if (cipher == null) throw new ArgumentNullException("cipher");

            //parse base64 string
            byte[] data = Convert.FromBase64String(cipher);

            DataProtectionScope Scope = default(DataProtectionScope);
            //decrypt data
            byte[] decrypted = ProtectedData.Unprotect(data, null, Scope);
            return Encoding.Unicode.GetString(decrypted);
        }

        public void RemoveUser(User user)
        {
            var User = new User { ID = user.ID };
            entity.User.Attach(User);
            entity.User.Remove(User);
            entity.SaveChanges();
        }

        public void RemoveWord(WordsCategory word)
        {
            var Word = new WordsCategory { ID = word.ID };
            entity.Words.Attach(Word);
            entity.Words.Remove(Word);
            entity.SaveChanges();
        }

        public void RemoveSearchString(SearchStringsCategory SearchString) {
            var searchString = new SearchStringsCategory { ID = SearchString.ID };
            entity.SearchStrings.Attach(searchString);
            entity.SearchStrings.Remove(searchString);
            entity.SaveChanges();
        }

        public string LoginUser(string email, string pass)
        {
            var user = entity.User.Select(x => new UserDto { ID = x.ID, email = x.email, Name = x.Name, Position = x.Position, Role = x.Role, Surname = x.Surname, user_password = x.user_password, Points = x.Points }).Where(x => x.email == email).First(); 
            //string decPass = Decrypt(user.user_password);
            if(user.user_password == pass)
            {
                return JsonConvert.SerializeObject(user);
            } else
            {
                return "Invalid password";
            }
        }
    }
}