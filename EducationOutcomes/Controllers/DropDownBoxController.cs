using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EducationOutcomes.Controllers
{

    [System.Web.Http.RoutePrefix("api/dropdown")]
    public class DropDownBoxController : Controller
    {

        PublicSchoolPovertyEntities db = new PublicSchoolPovertyEntities();

        [System.Web.Http.Route("district")]
        [System.Web.Http.HttpGet]
        public IEnumerable<object> GetDistrictList()
        {
            var DistrictQuery = from t in db.Districts
                                join d in db.TestResults on t.DistrictId equals d.DistrictId
                                select new
                                {
                                    t.DistrictName

                                };
            return DistrictQuery.Distinct().ToList();
        }

        //------------------------------------socioEcoStatus---------------------------------------


        [System.Web.Http.Route("socio")]
        [System.Web.Http.HttpGet]
        public IEnumerable<object> GetSocioList()
        {
            var DistrictQuery = from s in db.SocioeconomicStatus
                                join d in db.TestResults on s.SocioeconomicStatusId equals d.DistrictId
                                select new
                                {
                                    s.SocioeconomicStatus

                                };
            return DistrictQuery.Distinct().ToList();
        }
    }
}