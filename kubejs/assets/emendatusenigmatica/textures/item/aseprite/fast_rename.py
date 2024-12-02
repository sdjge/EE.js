import os
import regex

path = 'f:/MC/Curse/Instances/Omniworld R/kubejs/assets/emendatusenigmatica/textures/item/aseprite/output/'
fileList = os.listdir(path)
materialId = input('Material Name? :')

numberToNameMap = {
    '1': '*_gem_block',
    '2': '*_block',
    '3': '*_gem',
    '4': '*',
    '5': 'raw_*_block',
    '6': '*_axe',
    '7': '*_boots',
    '8': '*_chestplate',
    '9': '*_clump',
    '10': '*_cluster_shard',
    '11': '*_crushed_ore',
    '12': '*_crystal',
    '13': '*_dirty_dust',
    '14': '*_dust',
    '15': '*_fragment',
    '16': '*_gear',
    '17': '*_gravel',
    '18': '*_helmet',
    '19': '*_hoe',
    '20': '*_ingot',
    '21': '*_leggings',
    '22': '*_nugget',
    '23': '*_pickaxe',
    '24': '*_plate',
    '25': 'raw_*',
    '26': '*_rod',
    '27': '*_shard',
    '28': '*_shovel',
    '29': '*_sword'
}

for i in fileList: 
    # print(path + i)

    if(regex.match(materialId + '_\d', i)): 
        # print(i.split('_')[1])
        number = i.split('_')[1].replace('.png', '')
        if(numberToNameMap[number] == ''): 
            pass
        else: 
            os.rename(path + i, path + numberToNameMap[number].replace('*', materialId) + '.png')
    else: 
        pass
