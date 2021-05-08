const tgCollapse = function (object){
  // validate object
  if(!object.queryStr){
    console.log("does not have query string!");
    return;
  }
  if(!object.attrTarget){
    console.log("does not have attribute target!");
    return;
  }

  
  // validate data
  const elements = $(object.queryStr);
  // validate elements
  if(!elements.length){
    console.log("there is no element of: " + object.queryStr);
    return;
  }
  // 
  elements.each(function (index, element){
    if(!$(this)[0].hasAttribute(object.attrTarget)){
      console.log("there is no attribute for getting target")
    }

    if(!$($(this).attr(object.attrTarget)).length){
      console.log("there is no target!");
      return;
    }

    $(this).on("click", function(){
      //toggle
      if (object.transition){
        $($(this).attr(object.attrTarget)).slideToggle(object.transition);
      }
      else{
        $($(this).attr(object.attrTarget)).slideToggle();
      }
      

      //icon
      if (object.icon.hasIcon){
        if(object.icon.iconQuery === "this"){
          $(this).toggleClass(object.icon.toggleClass);
          if(object.transition){
            $(this).css('transition', object.transition);
          }
          return;
        }
        if(!$(this).find(object.icon.iconQuery).length){
          console.log("cannot find icon!");
          return;
        }
        const toggleIcon =  $(this).find(object.icon.iconQuery).find('img, i, svg')
        toggleIcon.toggleClass(object.icon.toggleClass);
        if(object.transition){
          toggleIcon.css('transition', object.transition)
        }
      }
      
    });

  });
}

const tgWithClasses = (object) => {
  
  // validate object
  if(!object.queryStr){
    console.log("does not have query string!");
    return;
  }
  if(!object.attrTarget){
    console.log("does not have attribute target!");
    return;
  }

  // validate data
  const elements = $(object.queryStr);
  // validate elements
  if(!elements.length){
    console.log("there is no element of: " + object.queryStr);
    return;
  }

  elements.on("click", function(){
    if(!$(this).attr(object.attrTarget)){
      console.log(`object does not have attribute target!`);
      return;
    }

    const target = $($(this).attr(object.attrTarget));
    console.log(target)
    if (!target.length){
      console.log(`can not found ${$(this).attr(object.attrTarget)}`);
      return;
    }

    target.toggleClass(object.withClasses || "active");
  });
}