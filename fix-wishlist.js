const fs = require('fs');
const path = 'c:/Users/dolby/OneDrive/Desktop/E-Commerce/frontend/src/pages/Wishlist.js';
let content = fs.readFileSync(path, 'utf8');

// Count opening and closing divs
const openDivs = (content.match(/<div/g) || []).length;
const closeDivs = (content.match(/<\/div>/g) || []).length;
console.log('Open divs:', openDivs, 'Close divs:', closeDivs);

// Simply add the missing closing divs before ); in the empty state
content = content.replace(
  '          </div>\n      </div>\n    );',
  '          </div>\n        </div>\n      </div>\n    );'
);

// Fix the end of the component - add missing </div> before final </div>
content = content.replace(
  '                </div>\n            </div>\n          ))}\n        </div>\n    </div>\n  );\n};\n\nexport default Wishlist;',
  '                </div>\n              </div>\n            </div>\n          ))}\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default Wishlist;'
);

fs.writeFileSync(path, content);
console.log('Fixed Wishlist.js!');
