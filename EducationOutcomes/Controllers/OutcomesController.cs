using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace EducationOutcomes.Controllers
{
    [System.Web.Http.RoutePrefix("api/Outcomes")]
    public class OutcomesController : ApiController
    {
        //PublicSchoolPovertyEntities povertyEntities = new PublicSchoolPovertyEntities();
        // GET: Outcomes
        //----------------------------------SchoolDropDown---------------------------------------
        //public IEnumerable<object> GetSchoolDistricts()
        //{
        //    var schools = from school in povertyEntities.Poverties
        //                  orderby school.School.School1
        //                  select new { school.School.SchoolId, school.School.School1 };
        //    return schools.ToList();
        //}

        //[System.Web.Http.Route("getDistrictPercentage")]
        //[System.Web.Http.HttpGet]
        //public IHttpActionResult GetDistrictPercentage(string schoolID)
        //{
        //    int myInt = Int32.Parse(schoolID);
        //    var schoolPercentage = from school in povertyEntities.Poverties
        //                           where school.SchoolId == myInt
        //                           select new { school.School.School1, school.PovPercent };

        //    return Ok(schoolPercentage);
        //}


        //----------------------------------District Dropdown ----------------------------------------------------
        PublicSchoolPovertyEntities db = new PublicSchoolPovertyEntities();

        [System.Web.Http.Route("district")]
        [System.Web.Http.HttpGet]
        public IEnumerable<object> GetDistrictList()
        {
            var DistrictQuery = from d in db.Districts
                                join gr in db.GraduationRates on d.DistrictId equals gr.DistrictId
                                join t in db.TestResults on d.DistrictId equals t.DistrictId
                                select new
                                {
                                    d.DistrictName

                                };
            return DistrictQuery.Distinct().ToList();
        }

        //------------------------------------socioEcoStatus---------------------------------------


        [System.Web.Http.Route("socio")]
        [System.Web.Http.HttpGet]
        public IEnumerable<object> GetSocioList()
        {
            var SocioQuery = from s in db.SocioeconomicStatus
                             join d in db.TestResults on s.SocioeconomicStatusId equals d.SocioeconomicStatusId
                             join gr in db.GraduationRates on s.SocioeconomicStatusId equals gr.GraduationId
                             select new
                             {
                                 s.SocioeconomicStatus

                             };
            return SocioQuery.Distinct().ToList();
        }

        //----------------------------------------School Dropdown---------------------------------------------------------------

        [System.Web.Http.Route("school")]
        [System.Web.Http.HttpGet]
        public IEnumerable<object> GetSchoolList()
        {
            var SocioQuery = from s in db.Schools
                             join d in db.TestResults on s.SchoolId equals d.SchoolId
                             join gr in db.GraduationRates on s.SchoolId equals gr.SchoolId
                             join socio in db.SocioeconomicStatus on d.SocioeconomicStatusId equals socio.SocioeconomicStatusId
                             where s.School1 == s.School1 && socio.SocioeconomicStatus == "Homeless"
                                     || socio.SocioeconomicStatus == "Non-Homeless"
                             select new
                             {
                                 s.School1

                             };
            return SocioQuery.Distinct().ToList();
        }

        //------------------------------------------Grade Dropdown-------------------------------------------------------------

        [System.Web.Http.Route("grades")]
        [System.Web.Http.HttpGet]
        public IEnumerable<object> GetGradeList()
        {
            var GradeQuery = from g in db.Grades
                             join t in db.TestResults on g.GradeId equals t.GradeId
                             select new
                             {
                                 g.Grade1
                             };
            return GradeQuery.Distinct().ToList();

        }

        //-------------------------------------Subject Drop down------------------------------------------

        [System.Web.Http.Route("subject")]
        [System.Web.Http.HttpGet]
        public IEnumerable<object> GetSubjectList()
        {
            var SubjectQuery = from g in db.Subjects
                               join t in db.TestResults on g.SubjectId equals t.SubjectId
                               select new
                               {
                                   g.SubjectName
                               };
            return SubjectQuery.Distinct().ToList();
        }

        [System.Web.Http.Route("title")]
        [System.Web.Http.HttpGet]
        public IEnumerable<object> GetTitleList()
        {
            var TitleQuery = from t in db.Titles
                               join s in db.Salaries on t.TitleId equals s.TitleId
                               select new
                               {
                                   t.TitleName
                               };
            return TitleQuery.Distinct().ToList();
        }

        [System.Web.Http.Route("provSchool")]
        [System.Web.Http.HttpGet]
        public IHttpActionResult GetPovSchool(string id, string id2)
        {
            try
            {
                var PovSchoolQuery = from gr in db.GraduationRates
                                     join d in db.Districts on gr.DistrictId equals d.DistrictId
                                     join pov in db.Poverties on gr.DistrictId equals pov.DistrictId  
                                     join sch in db.Schools on gr.SchoolId equals sch.SchoolId 
                                     join socio in db.SocioeconomicStatus on gr.SocioeconomicStatusId equals socio.SocioeconomicStatusId
                                     join tr in db.TestResults on gr.DistrictId equals tr.DistrictId
                                     where pov.SchoolId == sch.SchoolId && sch.SchoolId == tr.SchoolId 
                                     && socio.SocioeconomicStatusId == tr.SocioeconomicStatusId
                                     where sch.School1 == id && socio.SocioeconomicStatus == id2
                                     group new { gr.GraduationRate1, tr.PercentMetStandard }
                                     by new { d.DistrictName, sch.School1, socio.SocioeconomicStatus, pov.PovPercent }
                                     into SocioGroup
                                     orderby SocioGroup.Key.PovPercent
                                     select new
                                     {
                                         DistrictName = SocioGroup.Key.DistrictName,
                                         School1 = SocioGroup.Key.School1,
                                         SocioeconomicStatus = SocioGroup.Key.SocioeconomicStatus,
                                         PovPercent = SocioGroup.Key.PovPercent,
                                         GraduationRate1 = SocioGroup.Average(p => p.GraduationRate1),
                                         TestResults = SocioGroup.Average(p => p.PercentMetStandard)
                                     };
                return Ok(PovSchoolQuery);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }
    }
}

//var PovSchoolQuery = from gr in db.GraduationRates
//                     join d in db.Districts on gr.DistrictId equals d.DistrictId
//                     join sch in db.Schools on gr.SchoolId equals sch.SchoolId
//                     join socio in db.SocioeconomicStatus on gr.SocioeconomicStatusId equals socio.SocioeconomicStatusId
//                     join tr in db.TestResults on gr.DistrictId equals tr.DistrictId
//                     join pov in db.Poverties on gr.DistrictId equals pov.DistrictId
                                     //where sch.School1 == id

//AVG(CAST(TRIM('%' from PovPercent)AS float)) AS AvgPovPer

//try
//{
//    var PovSchoolQuery = from t in db.TestResults
//                         join s in db.Subjects on t.SubjectId equals s.SubjectId
//                         join so in db.SocioeconomicStatus on t.SocioeconomicStatusId equals so.SocioeconomicStatusId
//                         join sch in db.Schools on t.SchoolId equals sch.SchoolId
//                         join p in db.Poverties on t.SchoolId equals p.SchoolId
//                         join g in db.Grades on t.GradeId equals g.GradeId
//                         join d in db.Districts on t.DistrictId equals d.DistrictId
//                         where d.DistrictName == id && so.SocioeconomicStatus == id2
//                         select new
//                         {
//                             d.DistrictName,
//                             so.SocioeconomicStatus,
//                             s.SubjectName,
//                             sch.School1,
//                             g.Grade1,
//                             p.PovPercent,

//                         };
//    return Ok(PovSchoolQuery);
//}
//catch (Exception)
//{
//    return NotFound();
//}