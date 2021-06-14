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
                         select new {school.School.School1, school.PercentMetStandard };

            
            var newResult = from a in result
                            group a by a.School1 into aGroup
                            select new
                            {
                                School=aGroup.Key,
                                AverageGrade = aGroup.Average(b => b.PercentMetStandard)
                                
                            };
            if(topLow == "top")
            {
                return newResult.OrderByDescending(a => a.AverageGrade).Take(10).ToList();
            }
            else
            {
                return newResult.OrderBy(a => a.AverageGrade).Take(10).ToList();
            }
            
        }
//        select top 10 AVG(PercentMetStandard) as SchoolAverage, S.School
//from TestResults as TR
//    inner join School as S
//    on S.SchoolId=TR.SchoolId
//    inner join District as D
//    on D.DistrictId=TR.DistrictId
//    inner join Subject
//    on Subject.SubjectId=TR.SubjectId
//where Subject.SubjectId= 1
//Group by S.School
//order by SchoolAverage desc
    }



}