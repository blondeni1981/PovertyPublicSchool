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
        PublicSchoolPovertyEntities povertyEntities = new PublicSchoolPovertyEntities();
        // GET: Outcomes
        public IEnumerable<object> GetSchoolDistricts()
        {
            var schools = from school in povertyEntities.Poverties
                          orderby school.School.School1
                          select new { school.School.SchoolId, school.School.School1 };

            return schools.ToList();
        }

        [System.Web.Http.Route("getDistrictPercentage")]
        [System.Web.Http.HttpGet]
        public IHttpActionResult GetDistrictPercentage(string schoolID)
        {
            int myInt = Int32.Parse(schoolID);
            var schoolPercentage = from school in povertyEntities.Poverties
                                   where school.SchoolId == myInt
                                   select new { school.School.School1, school.PovPercent };

            return Ok(schoolPercentage);
        }

        [System.Web.Http.Route("getSchoolPerformance")]
        [System.Web.Http.HttpGet]

        public IEnumerable<object> GetSchoolPerformance(string topLow)
        {
            var result = from school in povertyEntities.TestResults
                         select new { school.School.School1, school.PercentMetStandard };


            var newResult = from a in result
                            group a by a.School1 into aGroup
                            select new
                            {
                                School = aGroup.Key,
                                AverageGrade = aGroup.Average(b => b.PercentMetStandard)

                            };
            if (topLow == "top")
            {
                return newResult.OrderByDescending(a => a.AverageGrade).Take(10).ToList();
            }
            else
            {
                return newResult.OrderBy(a => a.AverageGrade).Take(10).ToList();
            }

        }





        //------------------------------------socioEcoStatus---------------------------------------
        PublicSchoolPovertyEntities db = new PublicSchoolPovertyEntities();

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