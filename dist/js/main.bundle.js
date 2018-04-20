!(function(e) {
  var t = {};
  function a(c) {
    if (t[c]) return t[c].exports;
    var n = (t[c] = { i: c, l: !1, exports: {} });
    return e[c].call(n.exports, n, n.exports, a), (n.l = !0), n.exports;
  }
  (a.m = e),
    (a.c = t),
    (a.d = function(e, t, c) {
      a.o(e, t) ||
        Object.defineProperty(e, t, {
          configurable: !1,
          enumerable: !0,
          get: c
        });
    }),
    (a.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return a.d(t, "a", t), t;
    }),
    (a.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (a.p = ""),
    a((a.s = 14));
})([
  function(e, t) {},
  function(e, t, a) {
    "use strict";
    class c {
      static get DATABASE_URL() {
        return "http://localhost:8000/assets/data/restaurants.json";
      }
      static fetchRestaurants(e) {
        let t = new XMLHttpRequest();
        t.open("GET", c.DATABASE_URL),
          (t.onload = () => {
            if (200 === t.status) {
              const a = JSON.parse(t.responseText).restaurants;
              e(null, a);
            } else {
              const a = `Request failed. Returned status of ${t.status}`;
              e(a, null);
            }
          }),
          t.send();
      }
      static fetchRestaurantById(e, t) {
        c.fetchRestaurants((a, c) => {
          if (a) t(a, null);
          else {
            const a = c.find(t => t.id == e);
            a ? t(null, a) : t("Restaurant does not exist", null);
          }
        });
      }
      static fetchRestaurantByCuisine(e, t) {
        c.fetchRestaurants((a, c) => {
          if (a) t(a, null);
          else {
            const a = c.filter(t => t.cuisine_type == e);
            t(null, a);
          }
        });
      }
      static fetchRestaurantByNeighborhood(e, t) {
        c.fetchRestaurants((a, c) => {
          if (a) t(a, null);
          else {
            const a = c.filter(t => t.neighborhood == e);
            t(null, a);
          }
        });
      }
      static fetchRestaurantByCuisineAndNeighborhood(e, t, a) {
        c.fetchRestaurants((c, n) => {
          if (c) a(c, null);
          else {
            let c = n;
            "all" != e && (c = c.filter(t => t.cuisine_type == e)),
              "all" != t && (c = c.filter(e => e.neighborhood == t)),
              a(null, c);
          }
        });
      }
      static fetchNeighborhoods(e) {
        c.fetchRestaurants((t, a) => {
          if (t) e(t, null);
          else {
            const t = a.map((e, t) => a[t].neighborhood),
              c = t.filter((e, a) => t.indexOf(e) == a);
            e(null, c);
          }
        });
      }
      static fetchCuisines(e) {
        c.fetchRestaurants((t, a) => {
          if (t) e(t, null);
          else {
            const t = a.map((e, t) => a[t].cuisine_type),
              c = t.filter((e, a) => t.indexOf(e) == a);
            e(null, c);
          }
        });
      }
      static urlForRestaurant(e) {
        return `./restaurant.html?id=${e.id}`;
      }
      static imageUrlForRestaurant(e) {
        return `assets/data/${e.photograph}`;
      }
      static mapMarkerForRestaurant(e, t) {
        return new google.maps.Marker({
          position: e.latlng,
          title: e.name,
          url: c.urlForRestaurant(e),
          map: t,
          animation: google.maps.Animation.DROP
        });
      }
    }
    t.a = c;
  },
  function(e, t) {
    var a = "__googleMapsApiOnLoadCallback",
      c = ["channel", "client", "key", "language", "region", "v"];
    e.exports = function(e) {
      return (
        (e = e || {}),
        new Promise(function(t, n) {
          var d = setTimeout(function() {
            (window[a] = function() {}),
              n(new Error("Could not load the Google Maps API"));
          }, e.timeout || 1e4);
          window[a] = function() {
            null !== d && clearTimeout(d),
              t(window.google.maps),
              delete window[a];
          };
          var p = document.createElement("script"),
            r = ["callback=" + a];
          c.forEach(function(t) {
            e[t] && r.push(t + "=" + e[t]);
          }),
            e.libraries &&
              e.libraries.length &&
              r.push("libraries=" + e.libraries.join(",")),
            (p.src = "https://maps.googleapis.com/maps/api/js?" + r.join("&")),
            document.body.appendChild(p);
        })
      );
    };
  },
  function(e, t, a) {
    var c = {
      "./1.jpg": 4,
      "./10.jpg": 5,
      "./2.jpg": 6,
      "./3.jpg": 7,
      "./4.jpg": 8,
      "./5.jpg": 9,
      "./6.jpg": 10,
      "./7.jpg": 11,
      "./8.jpg": 12,
      "./9.jpg": 13
    };
    function n(e) {
      return a(d(e));
    }
    function d(e) {
      var t = c[e];
      if (!(t + 1)) throw new Error("Cannot find module '" + e + "'.");
      return t;
    }
    (n.keys = function() {
      return Object.keys(c);
    }),
      (n.resolve = d),
      (e.exports = n),
      (n.id = 3);
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "43ad39d7a7434cb91c101303a75cbb10-400.jpg 400w," +
        a.p +
        "a5b0218a24218e6d32569ad9131111cf-600.jpg 600w," +
        a.p +
        "ec525362904aef7f41bb1d9742bfa679-800.jpg 800w",
      images: [
        {
          path: a.p + "43ad39d7a7434cb91c101303a75cbb10-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "a5b0218a24218e6d32569ad9131111cf-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "ec525362904aef7f41bb1d9742bfa679-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "43ad39d7a7434cb91c101303a75cbb10-400.jpg",
      toString: function() {
        return a.p + "43ad39d7a7434cb91c101303a75cbb10-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "e119ebb5ce670b6c9e956f8ed569b061-400.jpg 400w," +
        a.p +
        "506c9d443797b13eef6b806d22107fad-600.jpg 600w," +
        a.p +
        "8ef2223f2f3cee6e5e01b74e961fdab0-800.jpg 800w",
      images: [
        {
          path: a.p + "e119ebb5ce670b6c9e956f8ed569b061-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "506c9d443797b13eef6b806d22107fad-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "8ef2223f2f3cee6e5e01b74e961fdab0-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "e119ebb5ce670b6c9e956f8ed569b061-400.jpg",
      toString: function() {
        return a.p + "e119ebb5ce670b6c9e956f8ed569b061-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "3c1922dd887ee4bc2800abc3192f37ee-400.jpg 400w," +
        a.p +
        "4ee373d128de79aa6d0fcff83369783f-600.jpg 600w," +
        a.p +
        "9987f02cdf9c9fe7c692f229530ed79c-800.jpg 800w",
      images: [
        {
          path: a.p + "3c1922dd887ee4bc2800abc3192f37ee-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "4ee373d128de79aa6d0fcff83369783f-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "9987f02cdf9c9fe7c692f229530ed79c-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "3c1922dd887ee4bc2800abc3192f37ee-400.jpg",
      toString: function() {
        return a.p + "3c1922dd887ee4bc2800abc3192f37ee-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "f9e2b955767edd3596a140b6ba1072f1-400.jpg 400w," +
        a.p +
        "159af426c037439bd811d01847c1699b-600.jpg 600w," +
        a.p +
        "e9244eb1edefc478c2f423e6c20d4d48-800.jpg 800w",
      images: [
        {
          path: a.p + "f9e2b955767edd3596a140b6ba1072f1-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "159af426c037439bd811d01847c1699b-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "e9244eb1edefc478c2f423e6c20d4d48-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "f9e2b955767edd3596a140b6ba1072f1-400.jpg",
      toString: function() {
        return a.p + "f9e2b955767edd3596a140b6ba1072f1-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "61c7e9420c08cdcad80acf8374115508-400.jpg 400w," +
        a.p +
        "5de9b587dc0064cdd6dd7b7229a85b16-600.jpg 600w," +
        a.p +
        "3c3ab63c6a42d3109a662b2109c985ec-800.jpg 800w",
      images: [
        {
          path: a.p + "61c7e9420c08cdcad80acf8374115508-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "5de9b587dc0064cdd6dd7b7229a85b16-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "3c3ab63c6a42d3109a662b2109c985ec-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "61c7e9420c08cdcad80acf8374115508-400.jpg",
      toString: function() {
        return a.p + "61c7e9420c08cdcad80acf8374115508-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "acd8a661ac58d09752cd244a151f5515-400.jpg 400w," +
        a.p +
        "d6d27e96171bf519b8db9b09dd749ae5-600.jpg 600w," +
        a.p +
        "f86d5748d95432a95d2e89fb714016db-800.jpg 800w",
      images: [
        {
          path: a.p + "acd8a661ac58d09752cd244a151f5515-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "d6d27e96171bf519b8db9b09dd749ae5-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "f86d5748d95432a95d2e89fb714016db-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "acd8a661ac58d09752cd244a151f5515-400.jpg",
      toString: function() {
        return a.p + "acd8a661ac58d09752cd244a151f5515-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "8a10a38dbf2739c81c73e4af009a8650-400.jpg 400w," +
        a.p +
        "e2f679773679c3b91eed62426a98cf2b-600.jpg 600w," +
        a.p +
        "7c7731eb889a928fc52ee9b71e0301aa-800.jpg 800w",
      images: [
        {
          path: a.p + "8a10a38dbf2739c81c73e4af009a8650-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "e2f679773679c3b91eed62426a98cf2b-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "7c7731eb889a928fc52ee9b71e0301aa-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "8a10a38dbf2739c81c73e4af009a8650-400.jpg",
      toString: function() {
        return a.p + "8a10a38dbf2739c81c73e4af009a8650-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "8197f45af23be3cd904fa0f8a0b04d5b-400.jpg 400w," +
        a.p +
        "fcd9c0ca85bda8e4e907f000c1bcd018-600.jpg 600w," +
        a.p +
        "27e1ec673f4284514d78fe34fb1177c8-800.jpg 800w",
      images: [
        {
          path: a.p + "8197f45af23be3cd904fa0f8a0b04d5b-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "fcd9c0ca85bda8e4e907f000c1bcd018-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "27e1ec673f4284514d78fe34fb1177c8-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "8197f45af23be3cd904fa0f8a0b04d5b-400.jpg",
      toString: function() {
        return a.p + "8197f45af23be3cd904fa0f8a0b04d5b-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "af03ab7c0299ba334e3482db3a081087-400.jpg 400w," +
        a.p +
        "030973888a6ccd23cadcf92367f3625c-600.jpg 600w," +
        a.p +
        "d33ef23a8fbc220f78f35179f6a5bfb4-800.jpg 800w",
      images: [
        {
          path: a.p + "af03ab7c0299ba334e3482db3a081087-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "030973888a6ccd23cadcf92367f3625c-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "d33ef23a8fbc220f78f35179f6a5bfb4-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "af03ab7c0299ba334e3482db3a081087-400.jpg",
      toString: function() {
        return a.p + "af03ab7c0299ba334e3482db3a081087-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    e.exports = {
      srcSet:
        a.p +
        "bca6d51efc202dfd54a1e74d3f279d87-400.jpg 400w," +
        a.p +
        "cd2ec47c14efed0e7398440581e430dd-600.jpg 600w," +
        a.p +
        "4f7ae739d7f108b6b929181a8013c430-800.jpg 800w",
      images: [
        {
          path: a.p + "bca6d51efc202dfd54a1e74d3f279d87-400.jpg",
          width: 400,
          height: 225
        },
        {
          path: a.p + "cd2ec47c14efed0e7398440581e430dd-600.jpg",
          width: 600,
          height: 338
        },
        {
          path: a.p + "4f7ae739d7f108b6b929181a8013c430-800.jpg",
          width: 800,
          height: 450
        }
      ],
      src: a.p + "bca6d51efc202dfd54a1e74d3f279d87-400.jpg",
      toString: function() {
        return a.p + "bca6d51efc202dfd54a1e74d3f279d87-400.jpg";
      },
      placeholder: void 0,
      width: 400,
      height: 225
    };
  },
  function(e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var c = a(0),
      n = (a.n(c), a(15)),
      d = (a.n(n), a(1));
    var p;
    const r = a(2);
    document.addEventListener("DOMContentLoaded", e => {
      console.log("loaded"), i(), s();
    });
    let i = () => {
        d.a.fetchNeighborhoods((e, t) => {
          e ? console.error(e) : ((self.neighborhoods = t), o());
        });
      },
      o = (e = self.neighborhoods) => {
        const t = document.getElementById("neighborhoods-select");
        e.forEach(e => {
          const a = document.createElement("option");
          (a.innerHTML = e), (a.value = e), t.append(a);
        });
      },
      s = () => {
        d.a.fetchCuisines((e, t) => {
          e ? console.error(e) : ((self.cuisines = t), f());
        });
      },
      f = (e = self.cuisines) => {
        const t = document.getElementById("cuisines-select");
        e.forEach(e => {
          const a = document.createElement("option");
          (a.innerHTML = e), (a.value = e), t.append(a);
        });
      };
    r({ key: "AIzaSyDXJhUDVZRlN4bLZm0nJbwsUUxRtCpRtQI", libraries: ["places"] })
      .then(e => {
        (p = new e.Map(document.getElementById("map"), {
          zoom: 12,
          center: { lat: 40.722216, lng: -73.9875 },
          scrollwheel: !1
        })),
          l();
      })
      .catch(e => {
        console.error(e);
      });
    const h = document.getElementById("neighborhoods-select"),
      g = document.getElementById("cuisines-select");
    h.addEventListener("change", () => {
      l();
    }),
      g.addEventListener("change", () => {
        l();
      });
    let l = () => {
        const e = document.getElementById("cuisines-select"),
          t = document.getElementById("neighborhoods-select"),
          a = e.selectedIndex,
          c = t.selectedIndex,
          n = e[a].value,
          p = t[c].value;
        d.a.fetchRestaurantByCuisineAndNeighborhood(n, p, (e, t) => {
          e ? console.error(e) : (u(t), b());
        });
      },
      u = e => {
        (self.restaurants = []),
          (document.getElementById("restaurants-list").innerHTML = ""),
          void 0 !== self.markers && self.markers.forEach(e => e.setMap(null)),
          (self.markers = []),
          (self.restaurants = e);
      },
      b = (e = self.restaurants) => {
        const t = document.getElementById("restaurants-list");
        e.forEach(e => {
          t.append(j(e));
        }),
          w();
      },
      j = e => {
        const t = document.createElement("li"),
          c = document.createElement("img");
        c.className = "restaurant-img";
        const n = a(3)(`./${e.photograph}`);
        (c.src = n.src),
          (c.srcset = n.srcSet),
          (c.alt = "Featured image of restaurant"),
          t.append(c);
        const p = document.createElement("h1");
        (p.innerHTML = e.name), t.append(p);
        const r = document.createElement("p");
        (r.innerHTML = e.neighborhood), t.append(r);
        const i = document.createElement("p");
        (i.innerHTML = e.address), t.append(i);
        const o = document.createElement("a");
        return (
          (o.innerHTML = "View Details"),
          (o.href = d.a.urlForRestaurant(e)),
          t.append(o),
          t
        );
      },
      w = (e = self.restaurants) => {
        e.forEach(e => {
          const t = d.a.mapMarkerForRestaurant(e, p);
          google.maps.event.addListener(t, "click", () => {
            window.location.href = t.url;
          }),
            self.markers.push(t),
            console.log(self.markers);
        });
      };
  },
  function(e, t, a) {
    e.exports = a.p + "assets/data/restaurants.json";
  }
]);
