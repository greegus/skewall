(function() {
  
  var $ = jQuery;

  function Transformable(element) {
    this.element = $(element).first().css('transform', '');

    this._initControlPoints();
  }

  Transformable.prototype._initControlPoints = function() {
    var self = this;

    if (this.controlPoints) {
      $(this.controlPoints).draggable('destroy').remove();
    } 

    var positions = ['left top', 'left bottom', 'right top', 'right bottom'];

    this.controlPoints = positions.map((position) => {
        return $('<div>')
          .css({
            cursor: 'move',
            position: 'absolute',
            zIndex: 100000
          })
          .position({
            at: position,
            of: self.element,
            collision: 'none'
          })
          .appendTo('body')
    });

    var getControlPointsPosition = () => 
      self.controlPoints.map((point) => [point.offset().left, point.offset().top])

    this.originalPos = getControlPointsPosition();

    $(this.controlPoints).draggable({
      start: () => {
        self.element.css('pointer-events', 'none');
      },
      drag: () => {
        self.applyTransform(self.element, self.originalPos, getControlPointsPosition());
      },
      stop: () => {
        self.applyTransform(self.element, self.originalPos, getControlPointsPosition());
        self.element.css('pointer-events', 'auto');
      }
    });
  }

  Transformable.prototype.getTransform = function(from, to) {
    var A, H, b, h, i, k_i, lhs, rhs, _i, _j, _k, _ref;
    
    A = [];
    for (i = _i = 0; _i < 4; i = ++_i) {
      A.push([from[i].x, from[i].y, 1, 0, 0, 0, -from[i].x * to[i].x, -from[i].y * to[i].x]);
      A.push([0, 0, 0, from[i].x, from[i].y, 1, -from[i].x * to[i].y, -from[i].y * to[i].y]);
    }
    
    b = [];
    for (i = _j = 0; _j < 4; i = ++_j) {
      b.push(to[i].x);
      b.push(to[i].y);
    }
    
    h = numeric.solve(A, b);
    H = [[h[0], h[1], 0, h[2]], [h[3], h[4], 0, h[5]], [0, 0, 1, 0], [h[6], h[7], 0, 1]];
    
    for (i = _k = 0; _k < 4; i = ++_k) {
      lhs = numeric.dot(H, [from[i].x, from[i].y, 0, 1]);
      k_i = lhs[3];
      rhs = numeric.dot(k_i, [to[i].x, to[i].y, 0, 1]);
    }
    return H;
  };

  Transformable.prototype.applyTransform = function(element, originalPos, targetPos) {
    var H, i, j, x, matrix;
    
    var from = originalPos.map((point) => ({
      x: point[0] - originalPos[0][0],
      y: point[1] - originalPos[0][1]
    }));

    var to = targetPos.map((point) => ({
      x: point[0] - originalPos[0][0],
      y: point[1] - originalPos[0][1]
    }));

    H = this.getTransform(from, to);
    
    matrix = [];
    
    for (i = 0; i < 4; i = ++i) { 
      x = [];

      for (j = 0; j < 4; j = ++j) {
        x.push(H[j][i].toFixed(20));
      }

      matrix.push(x);
    }

    $(element).css({
      'transform': "matrix3d(" + matrix.join(',') + ")",
      'transform-origin': '0 0'
    });
  };

  Transformable.prototype.reset = function() {
      this.applyTransform(this.element, this.originalPos, this.originalPos);
      this._initControlPoints();
  }

  window.Transformable = Transformable

}).call(this);
