$(document).ready(function () {
  tgCollapse({
    queryStr: ".my-collapse-1",
    attrTarget: 'tg-target',
    trasition: 400,
    icon:{
      hasIcon: true,
      iconQuery: 'this',
      toggleClass: 'rotate-z-90',
    },
  });
  tgWithClasses({
    queryStr: "#nav-toggler",
    attrTarget: 'tg-target',
    withClasses: 'active',
  });
  tgWithClasses({
    queryStr: "#dark-layer",
    attrTarget: 'tg-target',
    withClasses: 'active',
  });
});