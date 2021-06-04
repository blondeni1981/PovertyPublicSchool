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
    }



}