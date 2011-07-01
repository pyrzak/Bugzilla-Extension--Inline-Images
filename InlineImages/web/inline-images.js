/*
 * The contents of this file are subject to the Mozilla Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 *
 * The Original Code is the InlineImages Bugzilla Extension.
 *
 * The Initial Developer of the Original Code is Guy Pyrzak
 * Portions created by the Initial Developer are Copyright (C) 2010 the
 * Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Guy Pyrzak <guy.pyrzak@gmail.com>
 *   Gervase Markham <gerv@gerv.net>
 *   Byron Jones <byron@glob.com.au>
 */

var Dom = YAHOO.util.Dom;
var Event = YAHOO.util.Event;

YAHOO.util.Event.onDOMReady(function() {
  // Don't bother doing this if there are no images as attachments
  if (Dom.getElementsByClassName("is_image", "a", "comments").length == 0) {
    return;
  }
  
  var comments_expand_collapse = 
      Dom.getElementsByClassName('bz_collapse_expand_comments', 
                                 'ul', 
                                 'comments');
   
  // Check that what we're looking for is here      
  if (comments_expand_collapse.length == 0) {
    // Find the table we're looking for
    var commentsTable = Dom.getElementsByClassName("bz_comment_table", 
                                                   "table", 
                                                   "comments");
    secondColumn = commentsTable[0].getElementsByTagName("td")[1];
    var newUL = document.createElement("ul");
    if (secondColumn) {
      secondColumn.appendChild(newUL);
      comments_expand_collapse[0] = newUL;
    }
  }
  
  // Insert the li into the dom
  var li = document.createElement("li");
  var link = document.createElement("a");
  link.id = "toggle_images";
  link.href = "#";
  link.innerHTML = "Show Inline Images";
  link.onclick = YAHOO.bz_ext_inlineImage.toggleImages;
  li.appendChild(link);
  if (comments_expand_collapse.length > 0) {
    comments_expand_collapse[0].appendChild(li);
  }
  
  // Check to see if user has the inlineImagesCookie == on.
  // If it is, go ahead and show images for the user   
  var inlineImagesCookie = YAHOO.util.Cookie.get("inlineImagesCookie");
  if (inlineImagesCookie && inlineImagesCookie == "on") {
    YAHOO.bz_ext_inlineImage.toggleImages();
  }
});

YAHOO.namespace("bz_ext_inlineImage");
YAHOO.bz_ext_inlineImage.toggleImages = function(event) {
  var imgs = Dom.getElementsByClassName("inline_image", "img", "comments");
  var toggle_link_text = "";
  
  if (imgs.length == 0) {
    // Show inline images
      
    var alinks = Dom.getElementsByClassName("is_image", "a", "comments");
    for (var i = 0; i < alinks.length; i++) {
      var parentNode = alinks[i].parentNode;
      var img = document.createElement("img");
      img.src = alinks[i].href;
      img.className = "inline_image inline_image_scaled inline_image_clickable";
      if (Dom.hasClass(parentNode, 'bz_obsolete')) {
        Dom.addClass(img, 'bz_obsolete');
        Event.addListener(img, 'mouseover', YAHOO.bz_ext_inlineImage.clearObsolete);
        Event.addListener(img, 'mouseout', YAHOO.bz_ext_inlineImage.setObsolete);
      }
      Event.addListener(img, 'mouseover', YAHOO.bz_ext_inlineImage.setClickable);
      Event.addListener(img, 'click', YAHOO.bz_ext_inlineImage.toggleSize);
      Dom.insertAfter(img, parentNode);
    }
    
    YAHOO.util.Cookie.set("inlineImagesCookie", "on");
    toggle_link_text = "Hide Inline Images";
  } 
  else {
    // Hide inline images
      
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].parentNode.removeChild(imgs[i]);
    }
    
    YAHOO.util.Cookie.set("inlineImagesCookie", "off");
    toggle_link_text = "Show Inline Images";
  }
  
  var link = document.getElementById("toggle_images");
  link.innerHTML = toggle_link_text;
  
  return false;
};

YAHOO.bz_ext_inlineImage.setClickable = function(e) {
  if (this.offsetWidth < 256) {
    Dom.removeClass(this, 'inline_image_clickable');
    Event.removeListener(this, 'click');
  } else {
    this.title = "Click to show at full size.";
  }
};

YAHOO.bz_ext_inlineImage.clearObsolete = function(e) {
  Dom.removeClass(this, 'bz_obsolete');
};

YAHOO.bz_ext_inlineImage.setObsolete = function(e) {
  if (Dom.hasClass(this, 'inline_image_scaled'))
    Dom.addClass(this, 'bz_obsolete');
};

YAHOO.bz_ext_inlineImage.toggleSize = function(e) {
  if (Dom.hasClass(this, 'inline_image_scaled')) {
    Dom.removeClass(this, 'inline_image_scaled');
  } else {
    Dom.addClass(this, 'inline_image_scaled');
  }
};
