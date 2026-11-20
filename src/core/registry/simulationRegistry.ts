import React, { lazy } from 'react';
import { SimulationMetadata, SchoolLevel, GradeLevel, SubjectId } from '../../types/simulation.types';
import { CURRICULUM_CATALOG } from '../../data/curriculumCatalog';

// Lazy loading cho các simulation modules đã hoàn thiện
const AtomBuilderModule = lazy(() => import('../../simulations/chemistry/atom-builder'));
const SolidGeometry3DModule = lazy(() => import('../../simulations/math-geometry/solid-geometry-3d'));
const ProjectileMotionModule = lazy(() => import('../../simulations/physics/projectile-motion'));
const VisualTensesVoiceModule = lazy(() => import('../../simulations/english/visual-tenses-voice'));
const QuadraticParabolaModule = lazy(() => import('../../simulations/math/quadratic-parabola'));

// Modules lớp 7
const LightOpticsSoundModule = lazy(() => import('../../simulations/physics/light-optics-sound'));
const ProportionsProbabilityModule = lazy(() => import('../../simulations/math/proportions-probability'));
const TrianglesCongruenceModule = lazy(() => import('../../simulations/math-geometry/triangles-congruence'));
const PastFutureComparativesModule = lazy(() => import('../../simulations/english/past-future-comparatives'));

// Modules lớp 6
const StatesOfMatterModule = lazy(() => import('../../simulations/chemistry/states-of-matter'));
const ForcesSimpleMachinesModule = lazy(() => import('../../simulations/physics/forces-simple-machines'));
const IntegersFractionsModule = lazy(() => import('../../simulations/math/integers-fractions'));
const AnglesSymmetryModule = lazy(() => import('../../simulations/math-geometry/angles-symmetry'));

// Modules lớp 8
const ReactionBalancingModule = lazy(() => import('../../simulations/chemistry/reaction-balancing'));
const BuoyancyOpticsModule = lazy(() => import('../../simulations/physics/buoyancy-optics'));
const IdentitiesLinearFuncModule = lazy(() => import('../../simulations/math/identities-linear-func'));

// Modules THPT (Lớp 10)
const InequalitiesTrigCircleModule = lazy(() => import('../../simulations/math/inequalities-trig-circle'));

// Modules Môn học mới (Sinh học, Tin học, Địa lý)
const GeneticsMendelModule = lazy(() => import('../../simulations/biology/genetics-mendel'));
const BinaryLogicModule = lazy(() => import('../../simulations/informatics/binary-logic'));
const EarthSeasonsModule = lazy(() => import('../../simulations/geography/earth-seasons'));

// Mapping module đã triển khai vào catalog
export const SIMULATION_REGISTRY: SimulationMetadata[] = CURRICULUM_CATALOG.map(item => {
  if (item.id === 'chem-atom-builder') {
    return {
      ...item,
      isImplemented: true,
      component: AtomBuilderModule,
    };
  }
  if (item.id === 'geom-quadrilaterals-thales-pyramids') {
    return {
      ...item,
      isImplemented: true,
      component: SolidGeometry3DModule,
    };
  }
  if (item.id === 'phys-projectile-collision-energy') {
    return {
      ...item,
      isImplemented: true,
      component: ProjectileMotionModule,
    };
  }
  if (item.id === 'eng-present-simple-continuous' || item.id === 'eng-past-cont-conditionals-passive') {
    return {
      ...item,
      isImplemented: true,
      component: VisualTensesVoiceModule,
    };
  }
  if (item.id === 'math-linear-systems-quadratic') {
    return {
      ...item,
      isImplemented: true,
      component: QuadraticParabolaModule,
    };
  }
  if (item.id === 'phys-light-optics-sound') {
    return {
      ...item,
      isImplemented: true,
      component: LightOpticsSoundModule,
    };
  }
  if (item.id === 'math-real-numbers-proportions') {
    return {
      ...item,
      isImplemented: true,
      component: ProportionsProbabilityModule,
    };
  }
  if (item.id === 'geom-triangles-special-lines') {
    return {
      ...item,
      isImplemented: true,
      component: TrianglesCongruenceModule,
    };
  }
  if (item.id === 'eng-past-future-comparatives') {
    return {
      ...item,
      isImplemented: true,
      component: PastFutureComparativesModule,
    };
  }
  if (item.id === 'chem-states-of-matter') {
    return {
      ...item,
      isImplemented: true,
      component: StatesOfMatterModule,
    };
  }
  if (item.id === 'phys-forces-simple-machines') {
    return {
      ...item,
      isImplemented: true,
      component: ForcesSimpleMachinesModule,
    };
  }
  if (item.id === 'math-integers-fractions') {
    return {
      ...item,
      isImplemented: true,
      component: IntegersFractionsModule,
    };
  }
  if (item.id === 'geom-angles-symmetry') {
    return {
      ...item,
      isImplemented: true,
      component: AnglesSymmetryModule,
    };
  }
  if (item.id === 'chem-balancing-reactions') {
    return {
      ...item,
      isImplemented: true,
      component: ReactionBalancingModule,
    };
  }
  if (item.id === 'phys-buoyancy-refraction') {
    return {
      ...item,
      isImplemented: true,
      component: BuoyancyOpticsModule,
    };
  }
  if (item.id === 'math-identities-linear-func') {
    return {
      ...item,
      isImplemented: true,
      component: IdentitiesLinearFuncModule,
    };
  }
  if (item.id === 'math-inequalities-trig-circle') {
    return {
      ...item,
      isImplemented: true,
      component: InequalitiesTrigCircleModule,
    };
  }
  if (item.id === 'bio-genetics-mendel') {
    return {
      ...item,
      isImplemented: true,
      component: GeneticsMendelModule,
    };
  }
  if (item.id === 'cs-binary-logic-gates') {
    return {
      ...item,
      isImplemented: true,
      component: BinaryLogicModule,
    };
  }
  if (item.id === 'geo-earth-rotation-seasons') {
    return {
      ...item,
      isImplemented: true,
      component: EarthSeasonsModule,
    };
  }
  return item;
});

/**
 * Lấy danh sách mô phỏng theo bộ lọc
 */
export function getFilteredSimulations(filters: {
  level?: SchoolLevel | 'ALL';
  grade?: GradeLevel | 'ALL';
  subject?: SubjectId | 'ALL';
  searchTerm?: string;
}): SimulationMetadata[] {
  return SIMULATION_REGISTRY.filter(sim => {
    // Lọc cấp học
    if (filters.level && filters.level !== 'ALL' && sim.level !== filters.level) {
      return false;
    }

    // Lọc lớp học
    if (filters.grade && filters.grade !== 'ALL' && sim.grade !== filters.grade) {
      return false;
    }

    // Lọc môn học
    if (filters.subject && filters.subject !== 'ALL' && sim.subject !== filters.subject) {
      return false;
    }

    // Tìm kiếm từ khóa
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const q = filters.searchTerm.toLowerCase().trim();
      const matchTitle = sim.title.toLowerCase().includes(q) || sim.titleEn.toLowerCase().includes(q);
      const matchDesc = sim.description.toLowerCase().includes(q);
      const matchTopic = sim.topic.toLowerCase().includes(q);
      const matchTags = sim.tags.some(t => t.toLowerCase().includes(q));
      const matchCode = sim.curriculumCode.toLowerCase().includes(q);

      if (!matchTitle && !matchDesc && !matchTopic && !matchTags && !matchCode) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Tìm mô phỏng theo ID
 */
export function getSimulationById(id: string): SimulationMetadata | undefined {
  return SIMULATION_REGISTRY.find(s => s.id === id);
}

/**
 * Thống kê tổng quan số lượng bài học theo môn và cấp lớp
 */
export function getCurriculumStats() {
  const total = SIMULATION_REGISTRY.length;
  const thcsCount = SIMULATION_REGISTRY.filter(s => s.level === 'THCS').length;
  const thptCount = SIMULATION_REGISTRY.filter(s => s.level === 'THPT').length;
  const implementedCount = SIMULATION_REGISTRY.filter(s => s.isImplemented).length;

  const subjectCounts: Record<SubjectId, number> = {
    'toan': SIMULATION_REGISTRY.filter(s => s.subject === 'toan').length,
    'hinh-hoc': SIMULATION_REGISTRY.filter(s => s.subject === 'hinh-hoc').length,
    'khtn': SIMULATION_REGISTRY.filter(s => s.subject === 'khtn').length,
    'vat-ly': SIMULATION_REGISTRY.filter(s => s.subject === 'vat-ly').length,
    'hoa-hoc': SIMULATION_REGISTRY.filter(s => s.subject === 'hoa-hoc').length,
    'sinh-hoc': SIMULATION_REGISTRY.filter(s => s.subject === 'sinh-hoc').length,
    'tin-hoc': SIMULATION_REGISTRY.filter(s => s.subject === 'tin-hoc').length,
    'dia-ly': SIMULATION_REGISTRY.filter(s => s.subject === 'dia-ly').length,
    'lich-su': SIMULATION_REGISTRY.filter(s => s.subject === 'lich-su').length,
    'cong-nghe': SIMULATION_REGISTRY.filter(s => s.subject === 'cong-nghe').length,
    'gdkt-pl': SIMULATION_REGISTRY.filter(s => s.subject === 'gdkt-pl').length,
    'tieng-anh': SIMULATION_REGISTRY.filter(s => s.subject === 'tieng-anh').length,
  };

  return {
    total,
    thcsCount,
    thptCount,
    implementedCount,
    subjectCounts,
  };
}
