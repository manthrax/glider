 
let wichmannHillRNG = (s1 = 100, s2 = 100, s3 = 100) => () =>
((s1 = (171 * s1) % 30269) / 30269 +
  (s2 = (172 * s1) % 30307) / 30307 +
  (s3 = (170 * s1) % 30323) / 30323) %
1;

let prandom = wichmannHillRNG();


export default function Maze(sx=10,sz=10,ssr=1,w=.4) {
// sx-size of the maze
// sz-size of the maze
// sr-size of rooms
// w -wall size
    // function to draw a decorated wall
    ssr = Math.max(1,ssr)|0;
    let boxes = []
    let random = (min,max)=>(prandom() * (max - min)) + min;


    let wall=(x1, z1, x2, z2, height)=>{
        let x = (x1 + x2) / 2
          , z = (z1 + z2) / 2;
        let dx = x2 - x1
          , dz = z2 - z1
         // , ww = height > 0.5 ? w * 0.9 : w / 6;
        if (dx + dz == 0)
            return;
        // the wall
        boxes.push([[x, -1 + height / 2, z], [dx + w, height, dz + w]])
    }
    // generate a maze from (x1,z1) to (x2,z2)
    let maze=(x1, z1, x2, z2, height)=>{
        let dx = x2 - x1
          , dz = z2 - z1;
        
        let sr=ssr;//random(1,ssr+1)|0

        if (Math.min(dx, dz) < sr + 0.5)
            return;

    //sr = Math.max(1,sr)|0;
        
        if (dx > dz) {
            let midx = Math.round(random(x1 + sr, x2 - sr));
            let midz = Math.round(random(z1 + sr, z2 - sr + 1));

            wall(midx, z1, midx, midz - 1, height);
            wall(midx, midz, midx, z2, height);

            maze(x1, z1, midx, z2, height);
            maze(midx, z1, x2, z2, height);
        } else {
            let midx = Math.round(random(x1 + sr, x2 - sr + 1));
            let midz = Math.round(random(z1 + sr, z2 - sr));

            wall(x1, midz, midx - 1, midz, height);
            wall(midx, midz, x2, midz, height);

            maze(x1, z1, x2, midz, height);
            maze(x1, midz, x2, z2, height);
        }
    }
    // build main z-walls
    wall(-sx / 2, sz / 2, sx / 2, sz / 2, 1);
    wall(-sx / 2, -sz / 2, sx / 2, -sz / 2, 1);

    // build main x-walls with entry/exit doors
    let midz = Math.round(random(-sz / 2, sz / 2 - 1));
    wall(-sx / 2, -sz / 2, -sx / 2, midz, 1);
    wall(-sx / 2, midz + 1, -sx / 2, sz / 2, 1);

    midz = Math.round(random(-sz / 2, sz / 2 - 1));
    wall(sx / 2, -sz / 2, sx / 2, midz, 1);
    wall(sx / 2, midz + 1, sx / 2, sz / 2, 1);

    // generate the maze
    maze(-sx / 2, -sz / 2, sx / 2, sz / 2, 1 / 3);
    return boxes;
}
